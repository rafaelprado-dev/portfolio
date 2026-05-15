const doomEmbedUrl = "https://archive.org/embed/DoomsharewareEpisode";

export function DoomApp() {
  return (
    <div className="doom-app">
      <div className="doom-app__header">
        <div>
          <p className="app-kicker">/games/doom.exe</p>
          <h2>DOOM Shareware</h2>
        </div>
        <div className="doom-controls" aria-label="Controles principais do DOOM">
          <div className="doom-control doom-control--arrows">
            <div className="doom-keypad" aria-hidden="true">
              <span className="doom-key doom-key--arrow doom-key--up">↑</span>
              <span className="doom-key doom-key--arrow">←</span>
              <span className="doom-key doom-key--arrow">↓</span>
              <span className="doom-key doom-key--arrow">→</span>
            </div>
            <small>mover</small>
          </div>

          <div className="doom-control">
            <span className="doom-key">Ctrl</span>
            <small>atirar</small>
          </div>

          <div className="doom-control">
            <span className="doom-key doom-key--wide">Space</span>
            <small>usar</small>
          </div>

          <div className="doom-control">
            <span className="doom-key">Shift</span>
            <small>correr</small>
          </div>

          <div className="doom-control">
            <span className="doom-key">Esc</span>
            <small>menu</small>
          </div>
        </div>
      </div>

      <div className="doom-app__frame">
        <iframe
          allow="fullscreen; gamepad"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
          src={doomEmbedUrl}
          title="DOOM Shareware Episode"
        />
      </div>

      <p className="doom-app__note">
        Tudo roda DOOM, inclusive este portfólio.
        <span>Embed externo via Internet Archive.</span>
      </p>
    </div>
  );
}
