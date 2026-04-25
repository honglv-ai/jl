export const zodiacSigns = {
  capricorn: {
    name: '摩羯座',
    symbol: '♑',
    startDate: '2022-12-22',
    endDate: '2023-01-19',
    element: '土象',
    traits: ['务实', '纪律性强', '有野心', '冷静']
  },
  aquarius: {
    name: '水瓶座',
    symbol: '♒',
    startDate: '2023-01-20',
    endDate: '2023-02-18',
    element: '风象',
    traits: ['创新', '独立', '人道', '理想主义']
  },
  pisces: {
    name: '双鱼座',
    symbol: '♓',
    startDate: '2023-02-19',
    endDate: '2023-03-20',
    element: '水象',
    traits: ['同情', '艺术', '直觉', '温柔']
  },
  aries: {
    name: '白羊座',
    symbol: '♈',
    startDate: '2023-03-21',
    endDate: '2023-04-19',
    element: '火象',
    traits: ['勇敢', '热情', '行动力', '竞争']
  },
  taurus: {
    name: '金牛座',
    symbol: '♉',
    startDate: '2023-04-20',
    endDate: '2023-05-20',
    element: '土象',
    traits: ['稳定', '可靠', '感官', '务实']
  },
  gemini: {
    name: '双子座',
    symbol: '♊',
    startDate: '2023-05-21',
    endDate: '2023-06-20',
    element: '风象',
    traits: ['沟通', '适应', '聪慧', '多才']
  },
  cancer: {
    name: '巨蟹座',
    symbol: '♋',
    startDate: '2023-06-21',
    endDate: '2023-07-22',
    element: '水象',
    traits: ['直觉', '家庭', '保护', '情感']
  },
  leo: {
    name: '狮子座',
    symbol: '♌',
    startDate: '2023-07-23',
    endDate: '2023-08-22',
    element: '火象',
    traits: ['领导', '创意', '自信', '慷慨']
  },
  virgo: {
    name: '处女座',
    symbol: '♍',
    startDate: '2023-08-23',
    endDate: '2023-09-22',
    element: '土象',
    traits: ['分析', '精确', '低调', '实用']
  },
  libra: {
    name: '天秤座',
    symbol: '♎',
    startDate: '2023-09-23',
    endDate: '2023-10-22',
    element: '风象',
    traits: ['平衡', '外交', '艺术', '优雅']
  },
  scorpio: {
    name: '天蝎座',
    symbol: '♏',
    startDate: '2023-10-23',
    endDate: '2023-11-21',
    element: '水象',
    traits: ['神秘', '热烈', '专注', '强势']
  },
  sagittarius: {
    name: '射手座',
    symbol: '♐',
    startDate: '2023-11-22',
    endDate: '2023-12-21',
    element: '火象',
    traits: ['乐观', '诚实', '冒险', '理想']
  }
};

export function getZodiacSign(dateString) {
  try {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      return zodiacSigns.capricorn;
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      return zodiacSigns.aquarius;
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
      return zodiacSigns.pisces;
    } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      return zodiacSigns.aries;
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      return zodiacSigns.taurus;
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
      return zodiacSigns.gemini;
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
      return zodiacSigns.cancer;
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      return zodiacSigns.leo;
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      return zodiacSigns.virgo;
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
      return zodiacSigns.libra;
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      return zodiacSigns.scorpio;
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      return zodiacSigns.sagittarius;
    }
  } catch (error) {
    console.error('Invalid date:', dateString);
    return zodiacSigns.sagittarius; // Default to Sagittarius
  }
}
