import { NgModule } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { MenubarModule } from 'primeng/menubar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
	imports: [AvatarModule, OverlayPanelModule, MenubarModule, DividerModule, HomeRoutingModule],
	exports: [],
	providers: [],
	declarations: [HomeComponent],
})
export class HomeModule {}
