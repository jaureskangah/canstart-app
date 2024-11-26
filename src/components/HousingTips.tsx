import React from 'react';

export function HousingTips() {
  const tips = [
    {
      icon: '📄',
      title: 'Rental Guide',
      description: 'Learn about tenant rights and responsibilities in Canada',
      link: '#'
    },
    {
      icon: '🛡️',
      title: 'Rental Insurance',
      description: 'Why you need it and how to get it',
      link: '#'
    },
    {
      icon: '🧮',
      title: 'Cost Calculator',
      description: 'Estimate your total housing costs',
      link: '#'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Housing Resources</h3>

      <div className="space-y-4">
        {tips.map((tip) => (
          <a
            key={tip.title}
            href={tip.link}
            className="block p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{tip.icon}</span>
              <div>
                <h4 className="font-medium text-gray-900">{tip.title}</h4>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}