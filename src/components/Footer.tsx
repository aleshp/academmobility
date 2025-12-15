export default function Footer() {
  return (
    <footer className="bg-uni-secondary text-white pt-12 pb-6 text-sm">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="font-serif font-bold text-lg mb-4">INTERNATIONALIZATION CENTRE</h3>
          <p className="text-gray-400 max-w-xs">Центр интернационализации и академической мобильности.</p>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-wider mb-4 text-uni-accent">Контакты</h4>
          <p className="text-gray-400">г. Павлодар, ул. Олжабай Батыра 60</p>
          <p className="text-gray-400">+7 (7182) 67-36-85</p>
          <p className="text-gray-400">international@margulan.edu.kz</p>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-wider mb-4 text-uni-accent">Ресурсы</h4>
          <ul className="text-gray-400 space-y-2">
            <li><a href="#" className="hover:text-white">Политика конфиденциальности</a></li>
            <li><a href="#" className="hover:text-white">Правила приема</a></li>
            <li><a href="#" className="hover:text-white">Справочник студента</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} Margulan University. All rights reserved.
      </div>
    </footer>
  );
}