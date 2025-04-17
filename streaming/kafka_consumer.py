from kafka import KafkaConsumer
import json
import logging
from typing import Callable, Dict, Any

logger = logging.getLogger(__name__)

class SocialMediaConsumer:
    def __init__(self, bootstrap_servers: str, topic: str, group_id: str):
        self.consumer = KafkaConsumer(
            topic,
            bootstrap_servers=bootstrap_servers,
            group_id=group_id,
            auto_offset_reset='earliest',
            value_deserializer=lambda m: json.loads(m.decode('utf-8'))
        )
        
    def consume_messages(self, process_message: Callable[[Dict[str, Any]], None]):
        """Consume messages from a Kafka topic and process them"""
        try:
            for message in self.consumer:
                logger.info(f"Received message from partition {message.partition}, offset {message.offset}")
                process_message(message.value)
        except Exception as e:
            logger.error(f"Error consuming messages from Kafka: {e}")
            raise
