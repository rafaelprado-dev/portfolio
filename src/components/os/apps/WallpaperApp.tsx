import { wallpapers } from "@/content/wallpapers";

type WallpaperAppProps = {
  selectedWallpaperId: string;
  onSelectWallpaper: (wallpaperId: string) => void;
};

export function WallpaperApp({
  selectedWallpaperId,
  onSelectWallpaper,
}: WallpaperAppProps) {
  const selectedWallpaper =
    wallpapers.find((wallpaper) => wallpaper.id === selectedWallpaperId) ?? wallpapers[0];
  const selectedFileName = selectedWallpaper?.src.split("/").at(-1) ?? "";

  return (
    <div className="app-screen wallpaper-app">
      <p className="app-kicker">/painel/wallpaper.cpl</p>
      <h2>Plano de fundo</h2>
      <p>Troque o fundo do RafaelOS. A escolha fica salva neste navegador.</p>

      <div className="wallpaper-explorer">
        <div
          aria-label="Lista de wallpapers"
          className="wallpaper-explorer__list"
          role="listbox"
        >
          <strong>Arquivos</strong>
          {wallpapers.map((wallpaper) => {
            const isActive = selectedWallpaperId === wallpaper.id;

            return (
              <button
                aria-selected={isActive}
                className={isActive ? "is-active" : undefined}
                key={wallpaper.id}
                role="option"
                type="button"
                onClick={() => onSelectWallpaper(wallpaper.id)}
              >
                <span
                  aria-hidden="true"
                  style={{ backgroundImage: `url(${wallpaper.src})` }}
                />
                <strong>{wallpaper.name}</strong>
              </button>
            );
          })}
        </div>

        <section className="wallpaper-preview" aria-label="Prévia do wallpaper selecionado">
          <div
            aria-hidden="true"
            className="wallpaper-preview__screen"
            style={{ backgroundImage: `url(${selectedWallpaper?.src})` }}
          />

          <div className="wallpaper-preview__meta">
            <span>Wallpaper ativo</span>
            <strong>{selectedWallpaper?.name}</strong>
            <small>{selectedFileName}</small>
          </div>
        </section>
      </div>
    </div>
  );
}
