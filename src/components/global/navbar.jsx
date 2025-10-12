import { Button } from "../ui/button";

export default function Navbar () {
    return (
        <div className="w-[10.5rem] h-[25rem] border-3 border-neutral-950 rounded-sm flex flex-col items-center justify-center p-5 m-6 z-100">
            <div className="w-[8.5rem] h-[22rem] border-2 border-neutral-950 z-90">
                <div className="w-full h-full flex flex-col bg-amber-200 p-4 justify-evenly">
                    <Button variant={"outline"}>About</Button>
                    <Button variant={"outline"}>Accesibility</Button>
                    <Button variant={"outline"}>Music</Button>
                    <Button variant={"outline"}>Profile</Button>
                </div>
            </div>
        </div>
    )
}