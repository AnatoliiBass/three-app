
import ControllComponent from "./ControllComponent";
import ControllPanel from "./ControllPanel";
import DComponent from "./DComponent";
import FallingBoxes from "./FallingBoxes";
import FlexsabileCanvas from "./FlexsabileCanvas";
import Models from "./Models";
import SmallProject from "./SmallProject";
import Textures from "./Textures";


export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col">
      {/* <DComponent /> */}
      {/* <ControllComponent /> */}
      {/* <FlexsabileCanvas /> */}
      {/* <SmallProject /> */}
      <ControllPanel />
      {/* <Models /> */}
      {/* <Textures /> */}
      {/* <FallingBoxes /> */}
    </main>
  );
}
