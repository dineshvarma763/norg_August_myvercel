'use client' // Error components must be Client Components
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {

	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Error Component", error);
	}, [error]);

	return (
		<>
			<div className="relative flex h-screen items-center justify-center bg-my-blue px-4 pt-5 text-white">
				<div className="absolute top-0 left-0 p-4 ">
					<Image
						src="/norg-website/images/logo-blue.png"
						alt="Logo"
						width={140}
						height={38}
						className="object-contain md:max-w-[140px] xl:max-w-full"
					/>
				</div>
				<div className="mx-auto flex max-w-md flex-col">
					<h2 className="mt-4 text-center text-2xl font-bold">We hit an error!</h2>
					<p className="m-4 text-center text-lg">
						Oops! It looks like something has gone wrong with this page.
					</p>
					<Link
						href="/"
						className="rounded-md bg-my-indigo px-4 py-2 text-center text-lg hover:bg-my-darkerIndigo">
						Return to Home Page
					</Link>
				</div>
			</div>
		</>
	);
}
