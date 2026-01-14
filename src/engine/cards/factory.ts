import { CardFactory } from './cardFactory'

/**
 * Instance singleton du CardFactory.
 *
 * Les configurations sont enregistrées via `registerCard()` dans chaque feature.
 * Voir les fichiers `register.ts` dans chaque dossier de feature.
 *
 * Les mocks sont gérés séparément via les fixtures JSON dans `src/app/store/fixtures/`.
 */
export const cardFactory = new CardFactory()
