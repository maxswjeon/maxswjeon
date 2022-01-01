module.exports = {
    content: ['./src/**/*.{html,ts,tsx}'],
    theme: {
        extend: {
            boxShadow: {
                card: '0 20px 60px rgb(0 0 0 / 10%)',
            },
            fontFamily: {
                noto: ['"Noto Sans KR"', 'sans-serif'],
            },
            wordBreak: {
                keepall: 'word-break: keep-all',
            },
        },
    },
    plugins: [],
};
