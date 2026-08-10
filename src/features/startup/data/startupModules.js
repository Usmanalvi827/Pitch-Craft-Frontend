import { FileText, Layers, Users, ListChecks, LayoutTemplate, Presentation } from 'lucide-react'

export const startupModules = [
  {
    id: 'overview',
    title: 'Startup Overview',
    description: 'Generate an overview of your startup idea.',
    icon: FileText,
    estimatedTime: '~30 sec',
    buttonLabel: 'Generate Overview',
    route: 'overview',
    apiPath: 'generate-overview',
    dataKey: 'overview',
  },
  {
    id: 'business-model',
    title: 'Business Model',
    description: 'Define how your startup makes money.',
    icon: Layers,
    estimatedTime: '~45 sec',
    buttonLabel: 'Generate Business Model',
    route: 'business',
    apiPath: 'business-model',
    dataKey: 'businessModel',
  },
  {
    id: 'audience',
    title: 'Target Audience',
    description: 'Identify who your startup is really built for.',
    icon: Users,
    estimatedTime: '~30 sec',
    buttonLabel: 'Generate Audience',
    route: 'audience',
    apiPath: 'audience',
    dataKey: 'audience',
  },
  {
    id: 'features',
    title: 'Core Features',
    description: 'Outline the features that matter most for launch.',
    icon: ListChecks,
    estimatedTime: '~40 sec',
    buttonLabel: 'Generate Features',
    route: 'features',
    apiPath: 'features',
    dataKey: 'features',
  },
  {
    id: 'landing-page',
    title: 'Landing Page Copy',
    description: 'Write the copy for your startup landing page.',
    icon: LayoutTemplate,
    estimatedTime: '~50 sec',
    buttonLabel: 'Generate Landing Page',
    route: 'landing-page',
    apiPath: 'landing-page',
    dataKey: 'landingPage',
  },
  {
    id: 'pitch',
    title: 'Investor Pitch',
    description: 'Craft a pitch that is ready to send to investors.',
    icon: Presentation,
    estimatedTime: '~60 sec',
    buttonLabel: 'Generate Pitch',
    route: 'pitch',
    apiPath: 'pitch',
    dataKey: 'pitch',
  },
]

// same idea as the backend's SECTION_CHECKS - a section counts as
// generated if it has any real content in it
export function hasContent(section) {
  if (!section) return false
  return Object.values(section).some((value) => (Array.isArray(value) ? value.length > 0 : !!value))
}