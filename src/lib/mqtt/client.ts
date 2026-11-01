import mqtt, { MqttClient } from 'mqtt';
import { EventEmitter } from 'events';

export type MessageHandler = (topic: string, message: Buffer | string) => void;

class ResilientMqttBroker extends EventEmitter {
  private inMemoryBus = new EventEmitter();
  private realClient: MqttClient | null = null;
  private isConnected = false;
  private isInternalOnly = false;

  constructor() {
    super();
    this.inMemoryBus.setMaxListeners(100);
  }

  public init() {
    const brokerUrl = process.env.MQTT_BROKER_URL || 'internal';

    if (brokerUrl === 'internal' || brokerUrl === '') {
      this.isInternalOnly = true;
      this.isConnected = true;
      console.log('[MQTT] Running in built-in in-memory broker mode.');
      return;
    }

    try {
      this.realClient = mqtt.connect(brokerUrl, {
        clientId: process.env.MQTT_CLIENT_ID || `eco_srv_${Math.random().toString(16).slice(2, 8)}`,
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        reconnectPeriod: 2000,
        connectTimeout: 5000,
        will: {
          topic: 'ecoclass/backend/status',
          payload: Buffer.from(JSON.stringify({ status: 'offline', timestamp: new Date().toISOString() })),
          qos: 1,
          retain: true,
        },
      });

      this.realClient.on('connect', () => {
        this.isConnected = true;
        console.log(`[MQTT] Connected to external broker at ${brokerUrl}`);
      });

      this.realClient.on('message', (topic, payload) => {
        this.inMemoryBus.emit(topic, payload);
        this.inMemoryBus.emit('*', topic, payload);
      });

      this.realClient.on('error', (err) => {
        console.warn(`[MQTT] Broker connection error: ${err.message}. Falling back gracefully to in-memory bus.`);
        this.isInternalOnly = true;
      });

      this.realClient.on('offline', () => {
        this.isConnected = false;
      });
    } catch (err) {
      console.warn('[MQTT] Failed to initialize external client, using in-memory bus:', err);
      this.isInternalOnly = true;
      this.isConnected = true;
    }
  }

  public publish(topic: string, payload: unknown, qos: 0 | 1 | 2 = 1): Promise<void> {
    const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);

    // Always trigger in-memory subscribers so local listeners (simulator & engine) hear it immediately
    this.inMemoryBus.emit(topic, Buffer.from(serialized));
    this.inMemoryBus.emit('*', topic, Buffer.from(serialized));

    if (!this.isInternalOnly && this.realClient && this.isConnected) {
      return new Promise((resolve, reject) => {
        this.realClient!.publish(topic, serialized, { qos }, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    return Promise.resolve();
  }

  public subscribe(topic: string, handler: MessageHandler): void {
    if (topic.includes('+') || topic.includes('#')) {
      // Wildcard subscriber on all messages
      this.inMemoryBus.on('*', (incomingTopic: string, payload: Buffer) => {
        if (this.topicMatches(topic, incomingTopic)) {
          handler(incomingTopic, payload);
        }
      });
    } else {
      this.inMemoryBus.on(topic, (payload: Buffer) => {
        handler(topic, payload);
      });
    }

    if (!this.isInternalOnly && this.realClient && this.isConnected) {
      this.realClient.subscribe(topic, { qos: 1 });
    }
  }

  public unsubscribe(topic: string, handler?: MessageHandler): void {
    if (handler) {
      this.inMemoryBus.off(topic, handler);
    } else {
      this.inMemoryBus.removeAllListeners(topic);
    }

    if (!this.isInternalOnly && this.realClient && this.isConnected) {
      this.realClient.unsubscribe(topic);
    }
  }

  private topicMatches(filter: string, topic: string): boolean {
    const filterParts = filter.split('/');
    const topicParts = topic.split('/');

    for (let i = 0; i < filterParts.length; i++) {
      if (filterParts[i] === '#') return true;
      if (filterParts[i] !== '+' && filterParts[i] !== topicParts[i]) return false;
    }
    return filterParts.length === topicParts.length;
  }
}

export const mqttBroker = new ResilientMqttBroker();
mqttBroker.init();
