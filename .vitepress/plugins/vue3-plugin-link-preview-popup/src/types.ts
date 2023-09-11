export interface LinkPreviewPopupOptions {
  previewHostNames?: string[]
  selectorsToBeHided?: string[]
  handleIframeLoaded?: (element: HTMLIFrameElement) => Promise<void> | void
  popupTeleportTargetSelector?: string
}

export const defaultLinkPreviewPopupOptions: LinkPreviewPopupOptions = {
  previewHostNames: [],
  selectorsToBeHided: ['.VPNav', '.VPFooter', '.VPLocalNav', '.VPSidebar', '.VPDocFooter > .prev-next'],
  popupTeleportTargetSelector: 'body',
}

export const linkPreviewPopupInjectionKey = Symbol('link-preview-popup-options')
