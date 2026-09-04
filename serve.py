#!/usr/bin/env python3
"""Local preview server.

python3 -m http.server sends no cache headers, so a browser is free to hold on
to an .html file and keep requesting the old ?v= assets it names — which looks
exactly like "my changes did not save". This serves everything no-store, so a
plain reload is always the current file.

    python3 serve.py [port]        # default 8000
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = partial(NoCacheHandler, directory=".")
    print(f"SSLL DSP  ->  http://localhost:{port}/   (ctrl-c to stop)")
    ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
