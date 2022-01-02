const CertificateSection = () => (
    <section className="mb-3 border-b-2 border-b-gray-200 py-2">
        <h2 className="print:text-[16pt] font-bold text-2xl mb-3">Certificates</h2>
        <div className="grid grid-cols-12 print:text-[11pt] text-lg gap-3">
            <p className="md:col-span-2 col-span-3 text-gray-500">2021.12.</p>
            <p className="md:col-span-10 col-span-9">정보처리기능사</p>
            <p className="md:col-span-2 col-span-3 text-gray-500">2021.10.</p>
            <p className="md:col-span-10 col-span-9">아마추어무선통신기사(전화) 3급</p>
            <p className="md:col-span-2 col-span-3 text-gray-500">2020.12.</p>
            <p className="md:col-span-10 col-span-9">TOEIC (940/990)</p>
        </div>
    </section>
);

export default CertificateSection;
