import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, ListVideo, ChevronRight } from 'lucide-react';

const chapters = [
  { title: 'Upload File', time: 15, description: 'Import your data with ease' },
  { title: 'Customize Data', time: 45, description: 'Clean & structure your dataset' },
  { title: 'Preview Table', time: 75, description: 'Visual confirmation before charting' },
  { title: 'Generate Charts', time: 110, description: 'Create visualizations in one click' },
  { title: 'Export Results', time: 150, description: 'Save charts as PNG/CSV/SVG' }
];

const DemoVideo = () => {
  const iframeRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(0);

  const jumpTo = (time, index) => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    setActiveChapter(index);
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [time, true],
      }),
      '*'
    );
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: 'playVideo' }),
      '*'
    );
  };

  return (
    <section className="w-full px-4 md:px-16 py-20 bg-gray-50 mx-auto flex flex-col lg:flex-row gap-10" id="demo">
        {/* Sidebar chapters */}
        <div className="lg:w-1/3 space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-emerald-600">
            <ListVideo size={20} />
            Video Chapters
          </h3>
          <ul className="space-y-4">
            {chapters.map((chapter, idx) => (
              <li key={idx}>
                <button
                  onClick={() => jumpTo(chapter.time, idx)}
                  className={`flex items-center justify-between w-full p-4 rounded-lg transition-all duration-300 ${
                    activeChapter === idx
                      ? 'bg-gradient-to-r from-emerald-600/95 to-teal-500/95 text-white'
                      : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  <div className="text-left">
                    <h4 className={`font-semibold text-xl md:text-xl transition-colors duration-200 ${activeChapter === idx ? 'text-white' : 'text-gray-800'}`}>
                      {chapter.title}
                    </h4>
                    <p className={`text-lg transition-colors duration-200 ${activeChapter === idx ? 'text-white/90' : 'text-gray-600'}`}>
                      {chapter.description}
                    </p>
                  </div>
                  <ChevronRight className="ml-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* YouTube iframe */}
        <div className="flex-1 relative overflow-hidden rounded-xl shadow-2xl border border-gray-200">
          <div className="aspect-video w-full">
            <iframe
              ref={iframeRef}
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID?enablejsapi=1&rel=0&showinfo=0"
              title="DataViz ProX Demo Video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-xl"
              frameBorder="0"
            />
          </div>
        </div>
    </section>
  );
};

export default DemoVideo;
