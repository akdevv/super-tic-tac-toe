"use client";

import Button from "@/components/shared/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

export default function SettingsDrawer() {
	return (
		<Drawer shouldScaleBackground>
			<DrawerTrigger asChild>
				<Button variant="primary">Open Drawer</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>Move Goal</DrawerTitle>
						<DrawerDescription>
							Set your daily activity goal.
						</DrawerDescription>
					</DrawerHeader>

					<DrawerFooter>
						<Button>Submit</Button>
						<DrawerClose asChild>
							<Button variant="destructive">Cancel</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
