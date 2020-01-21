import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { FindLanguageFromKeyPipe } from 'app/shared/language/find-language-from-key.pipe';

@Injectable({ providedIn: 'root' })
export class LanguageHelper {
  private renderer: Renderer2;

  constructor(
    private translateService: TranslateService,
    private findLanguageFromKeyPipe: FindLanguageFromKeyPipe,
    rootRenderer: RendererFactory2
  ) {
    this.renderer = rootRenderer.createRenderer(document.querySelector('html'), null);

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);

      this.updatePageDirection();
    });
  }

  private updatePageDirection(): void {
    this.renderer.setAttribute(
      document.querySelector('html'),
      'dir',
      this.findLanguageFromKeyPipe.isRTL(this.translateService.currentLang) ? 'rtl' : 'ltr'
    );
  }
}
