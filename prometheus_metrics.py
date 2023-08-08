from prometheus_client import start_http_server, Summary
import time

# Create a metric to track request processing time
REQUEST_TIME = Summary('request_processing_seconds', 'Time spent processing requests')

def process_request():
    start_time = time.time()
    # Your request processing logic here
    time.sleep(1)  # Simulate processing time
    request_time = time.time() - start_time
    REQUEST_TIME.observe(request_time)

if __name__ == '__main__':
    start_http_server(8001)  # Expose metrics on port 8001
    while True:
        process_request()
