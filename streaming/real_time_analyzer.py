import logging
from typing import Dict, Any, List
from .stream_processor import StreamProcessor

logger = logging.getLogger(__name__)

class RealTimeAnalyzer(StreamProcessor):
    def __init__(self, bootstrap_servers: str, input_topic: str, output_topic: str, 
                 alert_threshold: float = 0.3, window_size: int = 100):
        super().__init__(bootstrap_servers, input_topic, output_topic)
        self.alert_threshold = alert_threshold
        self.window_size = window_size
        self.recent_sentiments = []
        
    def process_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a social media post message, analyze sentiment, and check for alerts
        """
        try:
            # Extract content and metadata
            content = message.get('content', '')
            platform = message.get('platform', 'unknown')
            
            # Perform sentiment analysis
            # In a real implementation, this would use a proper NLP model
            sentiment_score = self._analyze_sentiment(content)
            
            # Add sentiment to the message
            message['sentiment_score'] = sentiment_score
            
            # Update the recent sentiments window
            self._update_sentiment_window(sentiment_score)
            
            # Check for rapid sentiment change
            if self._check_sentiment_shift():
                message['alert'] = True
                message['alert_type'] = 'rapid_sentiment_change'
                logger.warning(f"Detected rapid sentiment change on {platform}")
            else:
                message['alert'] = False
            
            return message
            
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            # Return original message with error flag
            message['error'] = str(e)
            return message
            
    def _analyze_sentiment(self, content: str) -> float:
        """
        Placeholder for sentiment analysis
        Would be replaced with actual ML model in production
        """
        # Dummy implementation - would use a real model
        # Returns a value between -1 (negative) and 1 (positive)
        import random
        return random.uniform(-1, 1)
        
    def _update_sentiment_window(self, sentiment_score: float):
        """Update the sliding window of recent sentiment scores"""
        self.recent_sentiments.append(sentiment_score)
        if len(self.recent_sentiments) > self.window_size:
            self.recent_sentiments.pop(0)
            
    def _check_sentiment_shift(self) -> bool:
        """
        Check if there has been a significant shift in sentiment
        within the recent window
        """
        if len(self.recent_sentiments) < self.window_size // 2:
            return False
            
        # Split the window into two halves
        half_size = len(self.recent_sentiments) // 2
        first_half = self.recent_sentiments[:half_size]
        second_half = self.recent_sentiments[half_size:]
        
        # Calculate average sentiment for each half
        first_avg = sum(first_half) / len(first_half)
        second_avg = sum(second_half) / len(second_half)
        
        # Check if the difference exceeds the threshold
        return abs(second_avg - first_avg) > self.alert_threshold
