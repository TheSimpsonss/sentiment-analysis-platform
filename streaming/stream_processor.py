import logging
from kafka import KafkaConsumer, KafkaProducer
import json
from typing import Dict, Any

logger = logging.getLogger(__name__)

class StreamProcessor:
    def __init__(self, bootstrap_servers: str, input_topic: str, output_topic: str):
        self.input_topic = input_topic
        self.output_topic = output_topic
        
        # Set up consumer
        self.consumer = KafkaConsumer(
            input_topic,
            bootstrap_servers=bootstrap_servers,
            auto_offset_reset='earliest',
            value_deserializer=lambda m: json.loads(m.decode('utf-8'))
        )
        
        # Set up producer
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        
    def process_stream(self):
        """Process the stream of messages from input topic to output topic"""
        try:
            for message in self.consumer:
                # Process the message
                processed_data = self.process_message(message.value)
                
                # Send processed data to output topic
                self.producer.send(self.output_topic, processed_data)
                
        except Exception as e:
            logger.error(f"Error processing stream: {e}")
            raise
            
    def process_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process an individual message
        Override this method in subclasses to implement specific processing logic
        """
        # This is just a placeholder - actual processing would be done in subclasses
        return message
