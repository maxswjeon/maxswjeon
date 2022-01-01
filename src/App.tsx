import Character from './images/icons/character.png';
import ContactSection from './sections/ContactSection';
import EducationSection from './sections/EducationSection';
import ProjectSection from './sections/ProjectSection';

function App() {
    return (
        <div className="print:w-[21cm] print:h-[29.7cm] print:border-none print:m-0 print:p-0 container mx-auto sm:my-12 my-0 p-6 sm:shadow-card rounded-3xl">
            <header className="flex mb-3 border-b-2 border-b-gray-200 py-2">
                <div className="flex grow align-bottom items-end">
                    <h1 className="print:text-[24pt] text-4xl font-bold mb-3 align-text-bottom">
                        전상완 <br className="sm:hidden block" />
                        <span className="print:text-[16pt] text-2xl font-bold text-gray-500">Sangwan Jeon</span>
                    </h1>
                </div>
                <img
                    className="rounded-full print:w-[3.5cm] print:h-[3.5cm] box-border print:m-[0.5cm] w-[27.5vw] h-[27.5vw] max-w-[125px] max-h-[125px]"
                    src={Character}
                    alt="Profile Image"
                />
            </header>
            <ContactSection />
            <EducationSection />
            <ProjectSection />
        </div>
    );
}

export default App;
