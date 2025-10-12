import { Button } from "../ui/button";


export default function ComputerControls () {
    return (
        <div className="w-[43.75rem] h-[10.5rem] border-3 border-neutral-950 rounded-sm flex flex-col items-center justify-center p-5 m-6 z-100">
            <div className="w-[40.75rem] h-[29.25rem] border-2 border-neutral-950 z-90">
                <div className="w-full h-full items-center justify-evenly flex lg:flex-row sm:flex-col bg-amber-200 p-4">
                    <Button variant={"outline"}>Lorem</Button>
                    <Button variant={"outline"}>Lorem</Button>
                    <Button variant={"outline"}>Lorem</Button>
                    <Button variant={"outline"}>Lorem</Button>
                    <Button variant={"outline"}>Lorem</Button>

                </div>
            </div>
        </div>
    )
}