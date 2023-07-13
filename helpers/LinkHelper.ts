export interface LinkInfo {
  extType?: ExtensionType;
  link?: string;
}

export enum ExtensionType {
  NONE = 0,
  IMAGE = 1,
  VIDEO = 2,
  GENERIC = 3,
}

const imageExtensions = [
  'webp',
  'png',
  'avif',
  'heic',
  'jpeg',
  'jpg',
  'gif',
  'svg',
  'ico',
  'icns',
  'gifv',
];

const videoExtensions = ['mp4', 'mov', 'm4a'];

export const getLinkInfo = (link?: string): LinkInfo => {
  let type;

  if (!link) {
    type = ExtensionType.NONE;
  } else {
    const extension = link.split('.').pop();

    if (imageExtensions.includes(extension as string)) {
      const localTest =
        /(^127\.)|(^192\.168\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^::1$)|(^[fF][cCdD])/;

      if (localTest.test(link)) {
        type = ExtensionType.GENERIC;
      } else {
        type = ExtensionType.IMAGE;
      }
    } else if (videoExtensions.includes(extension as string)) {
      type = ExtensionType.VIDEO;
    } else {
      type = ExtensionType.GENERIC;
    }
  }

  return {
    link,
    extType: type,
  };
};
