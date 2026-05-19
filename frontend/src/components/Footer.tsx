import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { darkMode } = useTheme();
  const { t } = useTranslation();
  
  return (
    <footer className={`${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-200 text-gray-700'} py-8 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h2 className="font-bold text-xl mb-4 text-primary">{t('footer.about')}</h2>
            <p className="text-sm">
              {t('footer.aboutDescription')}
            </p>
          </div>

          {/* Account Section */}
          <div>
            <h2 className="font-bold text-xl mb-4 text-primary">{t('footer.account')}</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">{t('footer.myCart')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.checkout')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.shoppingDetails')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.order')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.helpCenter')}</a></li>
            </ul>
          </div>

          {/* Helpful Links Section */}
          <div>
            <h2 className="font-bold text-xl mb-4 text-primary">{t('footer.helpfulLinks')}</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">{t('footer.services')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.supports')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.feedback')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.termsConditions')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.privacyPolicy')}</a></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h2 className="font-bold text-xl mb-4 text-primary">{t('footer.socialMedia')}</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">Twitter</a></li>
              <li><a href="#" className="hover:text-primary">Facebook</a></li>
              <li><a href="#" className="hover:text-primary">Youtube</a></li>
              <li><a href="#" className="hover:text-primary">Linkedin</a></li>
              <li><a href="#" className="hover:text-primary">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className={`mt-8 pt-8 ${darkMode ? 'border-gray-700' : 'border-gray-300'} border-t text-center text-sm transition-colors duration-300`}>
          <p>Copyright © 2025 OctoCAT Supply. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;