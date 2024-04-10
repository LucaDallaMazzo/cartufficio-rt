import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core'
import { ConfirmationService, MessageService } from 'primeng/api'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import localeIt from '@angular/common/locales/it'
import { provideRouter } from '@angular/router'
import { registerLocaleData } from '@angular/common'
import { routes } from './app.routes'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'



registerLocaleData(localeIt)

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    MessageService,
    ConfirmationService, importProvidersFrom([
      BrowserAnimationsModule,
    ])

  ]
}
