import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from "shaders/react";

/**
 * Animated hero backdrop, built from the `shaders` stack and recoloured to the
 * Strum palette: a Sand → Cyprus swirl with a fluted-glass refraction overlay.
 */
export default function ShaderBackground() {
  return (
    <Shader style={{ width: "100%", height: "100%" }}>
      <Swirl colorA="#F0EDE4" colorB="#004741" detail={1.7} speed={0.5} />
      <ChromaFlow
        baseColor="#F0EDE4"
        downColor="#004741"
        leftColor="#004741"
        rightColor="#004741"
        upColor="#004741"
        momentum={13}
        radius={3.5}
      />
      <FlutedGlass
        aberration={0.61}
        angle={31}
        frequency={8}
        highlight={0.12}
        highlightSoftness={0}
        lightAngle={-90}
        refraction={4}
        shape="rounded"
        softness={1}
        speed={0.15}
      />
      <FilmGrain strength={0.05} />
    </Shader>
  );
}
