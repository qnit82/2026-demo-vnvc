const releaseMode = true;

const util = {
    //apiUrl: releaseMode ? 'https://api-demo-app.ivoca.asia/api' : 'https://localhost:7298/api',
    apiUrl: releaseMode ? 'https://api-demo-app.ivoca.asia/api' : 'http://localhost:5276/api',
    formatVND: (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    },
    bank: {
        stk: import.meta.env.VITE_BANK_STK || '03238309501',
        name: import.meta.env.VITE_BANK_ACCOUNT_NAME || 'NGUYEN HUU QUYEN',
        bankId: import.meta.env.VITE_BANK_ID || 'TPB'
    },
    getVietQRUrl: (amount: number) => {
        const { stk, name, bankId } = util.bank;
        return `https://img.vietqr.io/image/${bankId}-${stk}-compact2.jpg?amount=${amount}&accountName=${encodeURIComponent(name)}`;
    },
    toVietnameseWords: (number: number): string => {
        if (number === 0) return 'Không đồng';
        const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
        const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

        const readThreeDigits = (n: number, showZero: boolean): string => {
            let res = '';
            const h = Math.floor(n / 100);
            const t = Math.floor((n % 100) / 10);
            const u = n % 10;

            if (h > 0 || showZero) {
                res += digits[h] + ' trăm ';
            }

            if (t > 0) {
                if (t === 1) res += 'mười ';
                else res += digits[t] + ' mươi ';
            } else if (h > 0 && u > 0) {
                res += 'lẻ ';
            }

            if (u > 0) {
                if (t > 1 && u === 1) res += 'mốt';
                else if (t > 0 && u === 5) res += 'lăm';
                else if (t === 0 && u === 1 && (h > 0 || showZero)) res += 'một';
                else res += digits[u];
            }
            return res.trim();
        };

        let strNumber = Math.floor(number).toString();
        let groupCount = Math.ceil(strNumber.length / 3);
        let res = '';

        for (let i = 0; i < groupCount; i++) {
            let start = Math.max(0, strNumber.length - (i + 1) * 3);
            let end = strNumber.length - i * 3;
            let group = parseInt(strNumber.substring(start, end));
            if (group > 0) {
                let groupStr = readThreeDigits(group, i < groupCount - 1);
                res = groupStr + ' ' + units[i] + ' ' + res;
            }
        }

        res = res.trim();
        return res.charAt(0).toUpperCase() + res.slice(1) + ' đồng chẵn.';
    }
}

export default util;