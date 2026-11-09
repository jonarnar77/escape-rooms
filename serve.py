# Local dev server that tells the browser never to cache, so edits always load.
import http.server, functools
class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
http.server.ThreadingHTTPServer(('', 8000), NoCache).serve_forever()
