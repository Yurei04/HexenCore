import Navbar from "@/components/global/navbar";
import ComputerControls from "@/components/system/controls";
import ComputerLevers from "@/components/system/lever";
import ComputerScreen from "@/components/system/screen";
import Image from "next/image";

export default function Home() {
  return (
   <div className="w-full h-screen justify-between flex p-6 overflow-y-hidden">
      <div className="flex flex-col justify-end">
        <ComputerLevers>
          
        </ComputerLevers>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ComputerScreen>

        </ComputerScreen>
        <ComputerControls>

        </ComputerControls>
      </div>
      <div className="flex flex-col justify-start">
        <Navbar>

        </Navbar>
      </div>
   </div>
  );
}
