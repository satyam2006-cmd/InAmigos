from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import socket


HOST = "127.0.0.1"
PORT = 8000
WEB_ROOT = Path(__file__).resolve().parent / "InAmigos Website"


class InAmigosHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_ROOT), **kwargs)


def main():
    if not WEB_ROOT.exists():
        raise SystemExit(f"Website folder not found: {WEB_ROOT}")

    port = find_available_port(PORT)
    server = ThreadingHTTPServer((HOST, port), InAmigosHandler)
    print(f"InAmigos website running at http://{HOST}:{port}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        server.server_close()


def find_available_port(start_port):
    for port in range(start_port, start_port + 100):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
            if probe.connect_ex((HOST, port)) != 0:
                return port
    raise SystemExit("No available local port found from 8000 to 8099.")


if __name__ == "__main__":
    main()
