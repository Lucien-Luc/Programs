interface FlagProps {
  className?: string;
}

export const UKFlag = ({ className = "w-5 h-4" }: FlagProps) => (
  <svg className={className} viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="uk">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#uk)"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

export const FranceFlag = ({ className = "w-5 h-4" }: FlagProps) => (
  <svg className={className} viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
    <path fill="#ED2939" d="M60,0h30v60H60z"/>
    <path fill="#fff" d="M30,0h30v60H30z"/>
    <path fill="#002395" d="M0,0h30v60H0z"/>
  </svg>
);

export const RwandaFlag = ({ className = "w-5 h-4" }: FlagProps) => (
  <svg className={className} viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
    <path fill="#00A1DE" d="M0,0h90v20H0z"/>
    <path fill="#FAD201" d="M0,20h90v20H0z"/>
    <path fill="#00A651" d="M0,40h90v20H0z"/>
    <circle fill="#FAD201" cx="75" cy="10" r="8"/>
    <path fill="#00A1DE" d="M75,2 L77,8 L83,8 L78,12 L80,18 L75,14 L70,18 L72,12 L67,8 L73,8 Z"/>
  </svg>
);

export const GermanyFlag = ({ className = "w-5 h-4" }: FlagProps) => (
  <svg className={className} viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
    <path fill="#000" d="M0,0h90v20H0z"/>
    <path fill="#DD0000" d="M0,20h90v20H0z"/>
    <path fill="#FFCE00" d="M0,40h90v20H0z"/>
  </svg>
);

export const getFlagIcon = (countryCode: string) => {
  switch (countryCode) {
    case 'en':
      return UKFlag;
    case 'fr':
      return FranceFlag;
    case 'rw':
      return RwandaFlag;
    case 'de':
      return GermanyFlag;
    default:
      return UKFlag;
  }
};