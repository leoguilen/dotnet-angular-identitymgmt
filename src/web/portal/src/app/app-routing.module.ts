import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{
		path: 'home',
		loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule),
		canActivate: [AuthGuard],
	},
	{
		path: 'auth',
		loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
	},
	{ path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: 'top',
			anchorScrolling: 'enabled',
			initialNavigation: 'enabledBlocking',
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
