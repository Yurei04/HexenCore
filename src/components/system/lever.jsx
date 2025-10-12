import { Switch } from "../ui/switch";

export default function ComputerLevers () {
    return (
        <div className="w-[10.5rem] h-[25rem] border-3 border-neutral-950 rounded-sm flex flex-col items-center justify-center p-5 m-6 z-100">
            <div className="w-[8.5rem] h-[22rem] border-2 border-neutral-950 z-90">
                <div className="w-full h-full flex flex-col items-center justify-evenly bg-amber-200">
                    <Switch/>
                    <Switch/>
                    <Switch/>
                    <Switch/>
                    <Switch/>
                </div>
            </div>
        </div>
    )
}