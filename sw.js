// このファイルはGitHub Pagesなどで「SharedArrayBuffer」エラーを回避するために必要です。
// audio_splitter.html と同じフォルダに置いてください。

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // ステータス0 (opaque) の場合はそのまま返す
        if (response.status === 0) {
          return response;
        }

        // COOP/COEPヘッダーを付与した新しいレスポンスを作成
        // これによりブラウザのセキュリティ制限(SharedArrayBuffer)を回避します
        const newHeaders = new Headers(response.headers);
        newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
        newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      })
      .catch(function (e) {
        console.error(e);
      })
  );
});
