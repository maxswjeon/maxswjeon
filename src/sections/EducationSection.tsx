const EducationSection = () => (
    <section className="mb-3 border-b-2 border-b-gray-200 py-2">
        <h2 className="print:text-[16pt] font-bold text-2xl mb-3">Education</h2>
        <div className="grid grid-cols-12 print:text-[11pt] text-lg gap-3">
            <p className="md:col-span-2 col-span-3 text-gray-500">2021.03 ~ 현재</p>
            <p className="md:col-span-10 col-span-9">연세대학교 전기전자공학부 학사과정</p>
            <p className="md:col-span-2 col-span-3 text-gray-500">2018.03 ~ 2021.02</p>
            <p className="md:col-span-10 col-span-9">마포고등학교 (과학중점과정)</p>
        </div>
    </section>
);

export default EducationSection;
