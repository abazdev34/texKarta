{/* <div className="mb-6">
{!showVideo ? (
	<div className="bg-white p-4 rounded-lg shadow-md text-center">
		<p className="mb-4 text-gray-600">
			Китепти угуу үчүн төмөнкү баскычты басыңыз:
		</p>
		<button
			onClick={() => setShowVideo(true)}
			className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
		>
			Китепти угуу
		</button>
	</div>
) : (
	<div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center p-4">
		<div className="bg-white w-full max-w-3xl rounded-lg shadow-xl relative">
			{/* Header */}
			<div className="flex justify-between items-center p-4 border-b">
				<h3 className="text-lg font-semibold">
					Маркумдар үнү - {videos[currentVideo].title}
				</h3>
				<button
					onClick={() => setShowVideo(false)}
					className="text-gray-500 hover:text-gray-700 transition-colors"
				>
					✕
				</button>
			</div>

			{/* Video Player */}
			<div className="relative aspect-video w-full">
				<iframe
					className="absolute inset-0 w-full h-full"
					src={`https://www.youtube.com/embed/${videos[currentVideo].id}?si=ixZ8bVse9S8AWZvB`}
					title="YouTube video player"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerPolicy="strict-origin-when-cross-origin"
					allowFullScreen
				></iframe>
			</div>

			{/* Video Navigation */}
			<div className="p-4 border-t">
				{/* Video Selector Buttons */}
				<div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
					{videos.map((video, index) => (
						<button
							key={index}
							onClick={() => setCurrentVideo(index)}
							className={`p-2 rounded-lg text-sm font-medium transition-colors ${
								currentVideo === index
									? "bg-blue-600 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
						>
							{video.title}
						</button>
					))}
				</div>

				{/* Navigation Controls */}
				<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
					{/* Previous/Next Buttons */}
					<div className="flex gap-2 flex-1">
						<button
							onClick={previousVideo}
							className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
						>
							Мурунку
						</button>
						<button
							onClick={nextVideo}
							className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
						>
							Кийинки
						</button>
					</div>

					{/* Close Button */}
					<button
						onClick={() => setShowVideo(false)}
						className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Башкы бетке кайтуу
					</button>
				</div>

				{/* YouTube Link */}
				<a
					href={`https://www.youtube.com/watch?v=${videos[currentVideo].id}`}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-4 flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
				>
					<FaYoutube className="w-5 h-5" />
					<span>YouTube'да көрүү</span>
				</a>
			</div>
		</div>
	</div>
)}
</div> */}