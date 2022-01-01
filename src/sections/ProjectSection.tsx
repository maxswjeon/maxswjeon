import Projects, { Project } from '../../projects';

const projectToHtml = (project: Project, query?: string) => {
    if (
        !query ||
        project.languages.map((e) => e.toLowerCase()).includes(query) ||
        project.libraries.map((e) => e.toLowerCase()).includes(query)
    ) {
        return (
            <div key={project.name} className="grid grid-cols-12 py-2 gap-3">
                <p className="md:col-span-2 col-span-3 text-gray-500">{project.duration}</p>
                <div className="md:col-span-10 col-span-9 print:text-[11pt] text-lg">
                    <h3 className="font-bold">{project.name}</h3>
                    <p>{project.description}</p>
                    <p className="my-2">
                        <b>Languages</b>:{' '}
                        {project.languages.map((e) => (
                            <a key={'lang' + e} className="inline-block mx-2" href={`?query=${e}`}>
                                {e}
                            </a>
                        ))}
                    </p>
                    <p className="print:text-ellipsis print:overflow-hidden print:whitespace-nowrap">
                        <b>Libraries</b>:{' '}
                        {project.libraries.map((e) => (
                            <a key={'lib' + e} className="inline-block mx-2" href={`?query=${e}`}>
                                {e}
                            </a>
                        ))}
                    </p>
                    {project.source ? <a href={project.source}>소스 보기</a> : undefined}
                </div>
            </div>
        );
    }

    return null;
};

const ProjectSection = () => {
    const query = new URLSearchParams(window.location.search).get('query')?.toLowerCase();

    return (
        <section className="mb-3 border-b-2 border-b-gray-200 py-2">
            <div className="flex justify-between items-center">
                <h2 className="print:text-[16pt] font-bold text-2xl">Projects</h2>
                <input
                    defaultValue={query ? query : ''}
                    type="text"
                    className="border border-gray-400 my-3 p-2 w-100 print:hidden"
                    placeholder="언어 / 라이브러리 찾기"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            window.location.assign(`?query=${e.currentTarget.value}`);
                        }
                    }}
                />
            </div>
            {Projects.map((project) => projectToHtml(project, query))}
        </section>
    );
};

export default ProjectSection;
