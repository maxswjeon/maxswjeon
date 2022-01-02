import Character from './images/icons/character.png';
import ContactSection from './sections/ContactSection';
import EducationSection from './sections/EducationSection';
import ProjectSection from './sections/ProjectSection';
import CertificateSection from './sections/CertificateSection';

function App() {
    return (
        <>
            <div className="print:w-[21cm] print:h-[29.7cm] print:border-none print:m-0 print:p-0 container mx-auto sm:mt-12 sm:mb-32 p-6 sm:shadow-card rounded-3xl">
                <header className="flex mb-3 py-2">
                    <div className="flex grow align-bottom items-end  border-b-8 border-b-[#c4865f]">
                        <h1 className="print:text-[24pt] text-4xl font-bold mb-3 align-text-bottom">
                            전상완 <br className="sm:hidden block" />
                            <span className="print:text-[16pt] text-2xl font-bold text-gray-500">Sangwan Jeon</span>
                        </h1>
                    </div>
                    <img
                        className="rounded-full print:w-[3.5cm] print:h-[3.5cm] box-border print:m-[0.5cm] w-[27.5vw] h-[27.5vw] max-w-[125px] max-h-[125px] sm:ml-6"
                        src={Character}
                        alt="Profile Image"
                    />
                </header>
                <ContactSection />
                <EducationSection />
                <ProjectSection />
                <CertificateSection />
            </div>
            <p className="text-center my-5">
                이 페이지는 vite, react, tailwindcss로 제작되었습니다.
                <br />
                <a href="https://github.com/maxswjeon/maxswjeon">소스 보기</a>
            </p>
        </>
    );
}

export default App;
