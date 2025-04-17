from kafka import KafkaProducer
import json
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class SocialMediaProducer:
    def __init__(self, bootstrap_servers: str):
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        
    def send_message(self, topic: str, data: Dict[str, Any]):
        """Send data to a Kafka topic"""
        try:
            future = self.producer.send(topic, data)
            self.producer.flush()
            record_metadata = future.get(timeout=10)
            logger.info(f"Message sent to {record_metadata.topic} at partition {record_metadata.partition}, offset {record_metadata.offset}")
            return True
        except Exception as e:
            logger.error(f"Error sending message to Kafka: {e}")
            return False
