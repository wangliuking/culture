google.maps.__gjsload__('overlay', 'function Ds(a){this.b=a}L(Ds,V);Fa(Ds[C],function(a){"outProjection"!=a&&(a=!(!this.get("offset")||!this.get("projectionTopLeft")||!this.get("projection")||!N(this.get("zoom"))),a==!this.get("outProjection")&&this.set("outProjection",a?this.b:j))});function Es(){}function Fs(){var a=this.gm_props_;if(this.getPanes()){if(this[pj]()){if(!a.Pe&&this.onAdd)this.onAdd();a.Pe=i;this.draw()}}else{if(a.Pe)if(this[Xb])this[Xb]();else this[wb]();a.Pe=k}}function Gs(a){a.gm_props_=a.gm_props_||new Es;return a.gm_props_};function Hs(){}\nHs[C].b=function(a){var b=a[pc](),c=Gs(a),d=c.Fc;c.Fc=b;d&&(c=Gs(a),(d=c.Za)&&d[tj](),(d=c.zg)&&d[tj](),a[tj](),a.set("panes",j),a.set("projection",j),O(c.S,R[lb]),c.S=j,c.kb&&(c.kb.W(),c.kb.P(),c.kb=j));if(b){c=Gs(a);d=c.kb;d||(d=c.kb=new ah,d.W=P(a,Fs));O(c.S,R[lb]);var e=c.Za=c.Za||new xl,f=b.L();e[t]("zoom",f);e[t]("offset",f);e[t]("center",f,"projectionCenterQ");e[t]("projection",b);e[t]("projectionTopLeft",f);e=c.zg=c.zg||new Ds(e);e[t]("zoom",f);e[t]("offset",f);e[t]("projection",b);e[t]("projectionTopLeft",\nf);a[t]("projection",e,"outProjection");a[t]("panes",f);e=P(d,d.N);c.S=[R[G](a,"panes_changed",e),R[G](f,"zoom_changed",e),R[G](f,"offset_changed",e),R[G](b,"projection_changed",e),R[G](f,"projectioncenterq_changed",e),R[E](b,Ue,d)];d.N()}};var Is=new Hs;nf.overlay=function(a){eval(a)};qf("overlay",Is);\n')