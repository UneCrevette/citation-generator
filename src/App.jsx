import { useState } from "react";
import html2canvas from "html2canvas";
import { toPng } from "html-to-image";

export default function App() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [bgColor, setBgColor] = useState("#2CFFB4");
  const [contextText, setContextText] = useState("");

  // Nouvelle palette de couleurs fournie, dans l'ordre exact
  const colors = [
    "#2CFFB4",
    "#2CD8FF",
    "#2C94FF",
    "#312CFF",
    "#782CFF",
    "#A92CFF",
    "#D62CFF",
    "#FF2CD5",
    "#FF2C6F",
    "#FF2C2C",
    "#FF5F2C",
    "#FF8D2C",
    "#FFC32C",
    "#FFE82C",
    "#CAFF2C",
    "#85FF2C",
    "#2CFF95"
  ];

  const handleDownload = async () => {
    const element = document.getElementById("post");

    const waitFonts = document.fonts?.ready?.catch?.(() => {}) ?? Promise.resolve();
    await waitFonts;
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Adjust visual offsets during export to better match on-screen preview
    const glowEl = element.querySelector('#glow-rect');
    const cardEl = element.querySelector('#card-rect');
    const prevGlowTop = glowEl?.style.top;
    const prevGlowLeft = glowEl?.style.left;
    const prevGlowWidth = glowEl?.style.width;
    const prevGlowHeight = glowEl?.style.height;
    const prevCardShadow = cardEl?.style.boxShadow;
    try {
      if (glowEl) {
        glowEl.style.top = '-40px';
        glowEl.style.left = '-40px';
        glowEl.style.width = '100%';
        glowEl.style.height = '100%';
      }
      if (cardEl) {
        cardEl.style.boxShadow = '40px -40px 90px rgba(0, 0, 0, 0.35)';
      }
    } catch {}

    try {
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        width: 1080,
        height: 1350,
        backgroundColor: null,
        style: { width: "1080px", height: "1350px", margin: 0, padding: 0, display: "block" },
      });
      const link = document.createElement("a");
      link.download = "citation.png";
      link.href = dataUrl;
      link.click();
      return;
    } catch (err) {
      console.warn("html-to-image failed, falling back to html2canvas", err);
    }

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: null });
      const link = document.createElement("a");
      link.download = "citation.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("All capture methods failed", e);
    } finally {
      // restore preview values
      if (glowEl) {
        glowEl.style.top = prevGlowTop || '-30px';
        glowEl.style.left = prevGlowLeft || '-30px';
        glowEl.style.width = prevGlowWidth || '100%';
        glowEl.style.height = prevGlowHeight || '100%';
      }
      if (cardEl) {
        cardEl.style.boxShadow = prevCardShadow || '30px 30px 70px rgba(0, 0, 0, 0.35)';
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <h1 className="text-xl font-bold">Générateur de citations</h1>
      <textarea
        className="border rounded p-2 w-full"
        rows="3"
        placeholder="Écris ta citation..."
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
      />
      <input
        type="text"
        className="border rounded p-2 w-full"
        placeholder="Auteur"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <input
        type="text"
        className="border rounded p-2 w-full"
        placeholder="Contexte (ex: essayant de négocier des points pour un contrôle)"
        value={contextText}
        onChange={(e) => setContextText(e.target.value)}
      />

      <div className="grid grid-cols-6 gap-2">
        {colors.map((c, index) => (
          <button
            key={index}
            onClick={() => setBgColor(c)}
            style={{ backgroundColor: c, width: "40px", height: "40px" }}
            className={`rounded-full border-2 ${bgColor === c ? "border-black" : "border-transparent"}`}
          />
        ))}
      </div>

      <div
        id="post"
        className="flex justify-center items-center"
        style={{
          width: "1080px",
          height: "1350px",
          backgroundColor: bgColor,
          position: "relative",
        }}
      >
        <div className="flex flex-col items-center justify-center w-full h-full text-center">
          <div className="relative inline-block rotate-[-4deg]" style={{ maxWidth: "90%" }}>
            {contextText && (
              <p
                className="text-white text-left font-bold italic mb-6 break-words"
                style={{ fontSize: "48px", lineHeight: 1.1, fontFamily: "'Josefa Rounded Pro Bold Italic', sans-serif" }}
              >
                *{contextText}
              </p>
            )}
            <div className="relative inline-block">
              <div
                id="glow-rect"
                className="absolute"
                style={{ top: "-30px", left: "-30px", width: "100%", height: "100%", filter: "blur(70px)", backgroundColor: "#ffffff", borderRadius: "4px", zIndex: 0 }}
              />
              <div
                id="card-rect"
                className="relative px-10 py-8 bg-white inline-block"
                style={{ boxShadow: "30px 30px 70px rgba(0, 0, 0, 0.35)", borderRadius: "4px", zIndex: 1 }}
              >
                <p className="text-7xl font-bold italic leading-tight text-center" style={{ fontFamily: "'Josefa Rounded Pro Bold Italic', sans-serif" }}>
                  “{quote}”
                </p>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end pr-16">
            <p className="text-white text-6xl italic mt-12" style={{ fontFamily: "'Josefa Rounded Pro Bold Italic', sans-serif" }}>- {author}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-600 text-white rounded shadow"
      >
        Télécharger
      </button>

      
    </div>
  );
}