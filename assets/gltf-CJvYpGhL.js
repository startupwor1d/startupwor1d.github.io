import{V as f,M as B,J as K,a4 as be,a5 as ue,f as xe,m as Se,a as Ee,aN as Pe,C as Ae,G as Oe,k as ee,aM as Ie,d as Ne,aO as Re,v as se,K as He,aP as Te,X as Ue,Y as Fe,P as ke,Z as Ge,_ as Be,$ as Ve,aG as je,aA as We,a0 as we,aQ as Le,a1 as ze,a2 as Xe,ab as Ze,A as Ye,l as qe,af as Je}from"./stats.module-efKOrmjb.js";import{H as Ke}from"./HDRLoader-DRSvdv5v.js";import{K as Qe}from"./KTX2Loader-BZVlOv-J.js";import{g as $e}from"./lil-gui.module.min-DqZR5HPe.js";import{M as et}from"./MapControls-ChytPCxm.js";const z=new B;class V{constructor(e){e=e||{},this.zNear=e.webGL===!0?-1:0,this.vertices={near:[new f,new f,new f,new f],far:[new f,new f,new f,new f]},e.projectionMatrix!==void 0&&this.setFromProjectionMatrix(e.projectionMatrix,e.maxFar||1e4)}setFromProjectionMatrix(e,t){const a=this.zNear,r=e.elements[11]===0;return z.copy(e).invert(),this.vertices.near[0].set(1,1,a),this.vertices.near[1].set(1,-1,a),this.vertices.near[2].set(-1,-1,a),this.vertices.near[3].set(-1,1,a),this.vertices.near.forEach(function(n){n.applyMatrix4(z)}),this.vertices.far[0].set(1,1,1),this.vertices.far[1].set(1,-1,1),this.vertices.far[2].set(-1,-1,1),this.vertices.far[3].set(-1,1,1),this.vertices.far.forEach(function(n){n.applyMatrix4(z);const l=Math.abs(n.z);r?n.z*=Math.min(t/l,1):n.multiplyScalar(Math.min(t/l,1))}),this.vertices}split(e,t){for(;e.length>t.length;)t.push(new V);t.length=e.length;for(let a=0;a<e.length;a++){const r=t[a];if(a===0)for(let n=0;n<4;n++)r.vertices.near[n].copy(this.vertices.near[n]);else for(let n=0;n<4;n++)r.vertices.near[n].lerpVectors(this.vertices.near[n],this.vertices.far[n],e[a-1]);if(a===e.length-1)for(let n=0;n<4;n++)r.vertices.far[n].copy(this.vertices.far[n]);else for(let n=0;n<4;n++)r.vertices.far[n].lerpVectors(this.vertices.near[n],this.vertices.far[n],e[a])}}toSpace(e,t){for(let a=0;a<4;a++)t.vertices.near[a].copy(this.vertices.near[a]).applyMatrix4(e),t.vertices.far[a].copy(this.vertices.far[a]).applyMatrix4(e)}}const le={lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

vec3 geometryClearcoatNormal = vec3( 0.0 );

#ifdef USE_CLEARCOAT

	geometryClearcoatNormal = clearcoatNormal;

#endif

#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		// Iridescence F0 approximation
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif

IncidentLight directLight;

#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		pointLight = pointLights[ i ];

		getPointLightInfo( pointLight, geometryPosition, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;

		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;
 	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;

	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		spotLight = spotLights[ i ];

		getSpotLightInfo( spotLight, geometryPosition, directLight );

  		// spot lights are ordered [shadows with maps, shadows without maps, maps without shadows, none]
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;

		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && defined( USE_CSM ) && defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	float linearDepth = (vViewPosition.z) / (shadowFar - cameraNear);
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#if defined( USE_SHADOWMAP ) && defined( CSM_FADE )
		vec2 cascade;
		float cascadeCenter;
		float closestEdge;
		float margin;
		float csmx;
		float csmy;

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
				// NOTE: Depth gets larger away from the camera.
				// cascade.x is closer, cascade.y is further
				cascade = CSM_cascades[ i ];
				cascadeCenter = ( cascade.x + cascade.y ) / 2.0;
				closestEdge = linearDepth < cascadeCenter ? cascade.x : cascade.y;
				margin = 0.25 * pow( closestEdge, 2.0 );
				csmx = cascade.x - margin / 2.0;
				csmy = cascade.y + margin / 2.0;
				if( linearDepth >= csmx && ( linearDepth < csmy || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 ) ) {

					float dist = min( linearDepth - csmx, csmy - linearDepth );
					float ratio = clamp( dist / margin, 0.0, 1.0 );

					vec3 prevColor = directLight.color;
					directionalLightShadow = directionalLightShadows[ i ];
					directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

					bool shouldFadeLastCascade = UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth > cascadeCenter;
					directLight.color = mix( prevColor, directLight.color, shouldFadeLastCascade ? ratio : 1.0 );

					ReflectedLight prevLight = reflectedLight;
					RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

					bool shouldBlend = UNROLLED_LOOP_INDEX != CSM_CASCADES - 1 || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth < cascadeCenter;
					float blendRatio = shouldBlend ? ratio : 1.0;

					reflectedLight.directDiffuse = mix( prevLight.directDiffuse, reflectedLight.directDiffuse, blendRatio );
					reflectedLight.directSpecular = mix( prevLight.directSpecular, reflectedLight.directSpecular, blendRatio );
					reflectedLight.indirectDiffuse = mix( prevLight.indirectDiffuse, reflectedLight.indirectDiffuse, blendRatio );
					reflectedLight.indirectSpecular = mix( prevLight.indirectSpecular, reflectedLight.indirectSpecular, blendRatio );

				}
			#endif

		}
		#pragma unroll_loop_end
	#elif defined (USE_SHADOWMAP)

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )

				directionalLightShadow = directionalLightShadows[ i ];
				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y) directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && (linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1)) RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

			#endif

		}
		#pragma unroll_loop_end

	#elif ( NUM_DIR_LIGHT_SHADOWS > 0 )
		// note: no loop here - all CSM lights are in fact one light only
		getDirectionalLightInfo( directionalLights[0], directLight );
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	#endif

	#if ( NUM_DIR_LIGHTS > NUM_DIR_LIGHT_SHADOWS)
		// compute the lights not casting shadows (if any)

		#pragma unroll_loop_start
		for ( int i = NUM_DIR_LIGHT_SHADOWS; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];

			getDirectionalLightInfo( directionalLight, directLight );

			RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

		}
		#pragma unroll_loop_end

	#endif

#endif


#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && !defined( USE_CSM ) && !defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		directionalLight = directionalLights[ i ];

		getDirectionalLightInfo( directionalLight, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if defined( RE_IndirectDiffuse )

	vec3 iblIrradiance = vec3( 0.0 );

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	#if defined( USE_LIGHT_PROBES )

		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );

	#endif

	#if ( NUM_HEMI_LIGHTS > 0 )

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );

		}
		#pragma unroll_loop_end

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );

#endif
`,lights_pars_begin:`
#if defined( USE_CSM ) && defined( CSM_CASCADES )
uniform vec2 CSM_cascades[CSM_CASCADES];
uniform float cameraNear;
uniform float shadowFar;
#endif
	`+K.lights_pars_begin},ce=new B,X=new V({webGL:!0}),M=new f,tt=new f,H=new xe,Z=[],Y=[],q=new B,de=new B,it=new f(0,1,0);class at{constructor(e){this.camera=e.camera,this.parent=e.parent,this.cascades=e.cascades||3,this.maxFar=e.maxFar||1e5,this.mode=e.mode||"practical",this.shadowMapSize=e.shadowMapSize||2048,this.shadowBias=e.shadowBias||1e-6,this.lightDirection=e.lightDirection||new f(1,-1,1).normalize(),this.lightIntensity=e.lightIntensity||3,this.lightNear=e.lightNear||1,this.lightFar=e.lightFar||2e3,this.lightMargin=e.lightMargin||200,this.customSplitsCallback=e.customSplitsCallback,this.fade=!1,this.mainFrustum=new V({webGL:!0}),this.frustums=[],this.breaks=[],this.lights=[],this.shaders=new Map,this._createLights(),this.updateFrustums(),this._injectInclude()}_createLights(){for(let e=0;e<this.cascades;e++){const t=new be(16777215,this.lightIntensity);t.castShadow=!0,t.shadow.mapSize.width=this.shadowMapSize,t.shadow.mapSize.height=this.shadowMapSize,t.shadow.camera.near=this.lightNear,t.shadow.camera.far=this.lightFar,t.shadow.bias=this.shadowBias,this.parent.add(t),this.parent.add(t.target),this.lights.push(t)}}_initCascades(){const e=this.camera;e.updateProjectionMatrix(),this.mainFrustum.setFromProjectionMatrix(e.projectionMatrix,this.maxFar),this.mainFrustum.split(this.breaks,this.frustums)}_updateShadowBounds(){const e=this.frustums;for(let t=0;t<e.length;t++){const r=this.lights[t].shadow.camera,n=this.frustums[t],l=n.vertices.near,o=n.vertices.far,s=o[0];let d;s.distanceTo(o[2])>s.distanceTo(l[2])?d=o[2]:d=l[2];let h=s.distanceTo(d);if(this.fade){const m=this.camera,P=Math.max(m.far,this.maxFar),I=n.vertices.far[0].z/(P-m.near),F=.25*Math.pow(I,2)*(P-m.near);h+=F}r.left=-h/2,r.right=h/2,r.top=h/2,r.bottom=-h/2,r.updateProjectionMatrix()}}_getBreaks(){const e=this.camera,t=Math.min(e.far,this.maxFar);switch(this.breaks.length=0,this.mode){case"uniform":a(this.cascades,e.near,t,this.breaks);break;case"logarithmic":r(this.cascades,e.near,t,this.breaks);break;case"practical":n(this.cascades,e.near,t,.5,this.breaks);break;case"custom":this.customSplitsCallback===void 0&&console.error("CSM: Custom split scheme callback not defined."),this.customSplitsCallback(this.cascades,e.near,t,this.breaks);break}function a(l,o,s,d){for(let h=1;h<l;h++)d.push((o+(s-o)*h/l)/s);d.push(1)}function r(l,o,s,d){for(let h=1;h<l;h++)d.push(o*(s/o)**(h/l)/s);d.push(1)}function n(l,o,s,d,h){Z.length=0,Y.length=0,r(l,o,s,Y),a(l,o,s,Z);for(let m=1;m<l;m++)h.push(ue.lerp(Z[m-1],Y[m-1],d));h.push(1)}}update(){const e=this.camera,t=this.frustums;q.lookAt(tt,this.lightDirection,it),de.copy(q).invert();for(let a=0;a<t.length;a++){const r=this.lights[a],n=r.shadow.camera,l=(n.right-n.left)/this.shadowMapSize,o=(n.top-n.bottom)/this.shadowMapSize;ce.multiplyMatrices(de,e.matrixWorld),t[a].toSpace(ce,X);const s=X.vertices.near,d=X.vertices.far;H.makeEmpty();for(let h=0;h<4;h++)H.expandByPoint(s[h]),H.expandByPoint(d[h]);H.getCenter(M),M.z=H.max.z+this.lightMargin,M.x=Math.floor(M.x/l)*l,M.y=Math.floor(M.y/o)*o,M.applyMatrix4(q),r.position.copy(M),r.target.position.copy(M),r.target.position.x+=this.lightDirection.x,r.target.position.y+=this.lightDirection.y,r.target.position.z+=this.lightDirection.z}}_injectInclude(){K.lights_fragment_begin=le.lights_fragment_begin,K.lights_pars_begin=le.lights_pars_begin}setupMaterial(e){e.defines=e.defines||{},e.defines.USE_CSM=1,e.defines.CSM_CASCADES=this.cascades,this.fade&&(e.defines.CSM_FADE="");const t=[],a=this,r=this.shaders;e.onBeforeCompile=function(n){const l=Math.min(a.camera.far,a.maxFar);a._getExtendedBreaks(t),n.uniforms.CSM_cascades={value:t},n.uniforms.cameraNear={value:a.camera.near},n.uniforms.shadowFar={value:l},r.set(e,n)},r.set(e,null)}_updateUniforms(){const e=Math.min(this.camera.far,this.maxFar);this.shaders.forEach(function(a,r){if(a!==null){const n=a.uniforms;this._getExtendedBreaks(n.CSM_cascades.value),n.cameraNear.value=this.camera.near,n.shadowFar.value=e}!this.fade&&"CSM_FADE"in r.defines?(delete r.defines.CSM_FADE,r.needsUpdate=!0):this.fade&&!("CSM_FADE"in r.defines)&&(r.defines.CSM_FADE="",r.needsUpdate=!0)},this)}_getExtendedBreaks(e){for(;e.length<this.breaks.length;)e.push(new Se);e.length=this.breaks.length;for(let t=0;t<this.cascades;t++){const a=this.breaks[t],r=this.breaks[t-1]||0;e[t].x=r,e[t].y=a}}updateFrustums(){this._getBreaks(),this._initCascades(),this._updateShadowBounds(),this._updateUniforms()}remove(){for(let e=0;e<this.lights.length;e++)this.parent.remove(this.lights[e].target),this.parent.remove(this.lights[e])}dispose(){const e=this.shaders;e.forEach(function(t,a){delete a.onBeforeCompile,delete a.defines.USE_CSM,delete a.defines.CSM_CASCADES,delete a.defines.CSM_FADE,t!==null&&(delete t.uniforms.CSM_cascades,delete t.uniforms.cameraNear,delete t.uniforms.shadowFar),a.needsUpdate=!0}),e.clear()}}const{lerp:A}=ue,S=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];for(let i=0;i<256;i++)S[256+i]=S[i];function J(i){return i*i*i*(i*(i*6-15)+10)}function C(i,e,t,a){const r=i&15,n=r<8?e:t,l=r<4?t:r==12||r==14?e:a;return((r&1)==0?n:-n)+((r&2)==0?l:-l)}class ot{noise(e,t,a){const r=Math.floor(e),n=Math.floor(t),l=Math.floor(a),o=r&255,s=n&255,d=l&255;e-=r,t-=n,a-=l;const h=e-1,m=t-1,P=a-1,I=J(e),F=J(t),Ce=J(a),te=S[o]+s,ie=S[te]+d,ae=S[te+1]+d,oe=S[o+1]+s,re=S[oe]+d,ne=S[oe+1]+d;return A(A(A(C(S[ie],e,t,a),C(S[re],h,t,a),I),A(C(S[ae],e,m,a),C(S[ne],h,m,a),I),F),A(A(C(S[ie+1],e,t,P),C(S[re+1],h,t,P),I),A(C(S[ae+1],e,m,P),C(S[ne+1],h,m,P),I),F),Ce)}}const rt=`
    in vec3 position;

    uniform mat4 modelMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec3 cameraPos;

    out vec3 vOrigin;
    out vec3 vDirection;

    void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

        vOrigin = vec3( inverse( modelMatrix ) * vec4( cameraPos, 1.0 ) ).xyz;
        vDirection = position - vOrigin;

        gl_Position = projectionMatrix * mvPosition;
    }
`,nt=`
    precision highp float;
    precision highp sampler3D;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    in vec3 vOrigin;
    in vec3 vDirection;

    out vec4 color;

    uniform vec3 base;
    uniform sampler3D map;

    uniform float threshold;
    uniform float range;
    uniform float opacity;
    uniform float steps;
    uniform float frame;

    uint wang_hash(uint seed)
    {
        seed = (seed ^ 61u) ^ (seed >> 16u);
        seed *= 9u;
        seed = seed ^ (seed >> 4u);
        seed *= 0x27d4eb2du;
        seed = seed ^ (seed >> 15u);
        return seed;
    }

    float randomFloat(inout uint seed)
    {
        return float(wang_hash(seed)) / 4294967296.;
    }

    vec2 hitBox( vec3 orig, vec3 dir ) {
        const vec3 box_min = vec3( - 0.5 );
        const vec3 box_max = vec3( 0.5 );
        vec3 inv_dir = 1.0 / dir;
        vec3 tmin_tmp = ( box_min - orig ) * inv_dir;
        vec3 tmax_tmp = ( box_max - orig ) * inv_dir;
        vec3 tmin = min( tmin_tmp, tmax_tmp );
        vec3 tmax = max( tmin_tmp, tmax_tmp );
        float t0 = max( tmin.x, max( tmin.y, tmin.z ) );
        float t1 = min( tmax.x, min( tmax.y, tmax.z ) );
        return vec2( t0, t1 );
    }

    float sample1( vec3 p ) {
        return texture( map, p ).r;
    }

    float shading( vec3 coord ) {
        float step = 0.01;
        return sample1( coord + vec3( - step ) ) - sample1( coord + vec3( step ) );
    }

    vec4 linearToSRGB( in vec4 value ) {
        return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
    }

    void main(){
        vec3 rayDir = normalize( vDirection );
        vec2 bounds = hitBox( vOrigin, rayDir );

        if ( bounds.x > bounds.y ) discard;

        bounds.x = max( bounds.x, 0.0 );

        float stepSize = ( bounds.y - bounds.x ) / steps;

        uint seed = uint( gl_FragCoord.x ) * uint( 1973 ) + uint( gl_FragCoord.y ) * uint( 9277 ) + uint( frame ) * uint( 26699 );
        vec3 size = vec3( textureSize( map, 0 ) );
        float randNum = randomFloat( seed ) * 2.0 - 1.0;
        vec3 p = vOrigin + bounds.x * rayDir;
        p += rayDir * randNum * ( 1.0 / size );

        vec4 ac = vec4( base, 0.0 );

        for ( float i = 0.0; i < steps; i += 1.0 ) {
            float d = sample1( p + 0.5 );

            d = smoothstep( threshold - range, threshold + range, d ) * opacity;

            float col = shading( p + 0.5 ) * 3.0 + ( ( p.x + p.y ) * 0.25 ) + 0.2;

            ac.rgb += ( 1.0 - ac.a ) * d * col;
            ac.a += ( 1.0 - ac.a ) * d;

            if ( ac.a >= 0.95 ) break;

            p += rayDir * stepSize;
        }

        color = linearToSRGB( ac );

        if ( color.a == 0.0 ) discard;
    }
`;function st(i,e){const t=new Uint8Array(i*i*i),a=new ot,r=new f;let n=0;for(let o=0;o<i;o++)for(let s=0;s<i;s++)for(let d=0;d<i;d++){const h=1-r.set(d,s,o).subScalar(i/2).divideScalar(i).length();t[n]=(128+128*a.noise(d*e/1.5,s*e,o*e/1.5))*h*h,n++}const l=new Ne(t,i,i,i);return l.format=Re,l.minFilter=se,l.magFilter=se,l.unpackAlignment=1,l.needsUpdate=!0,l}function lt(i={}){const{size:e=96,noiseScale:t=.05,color:a=7965344,threshold:r=.25,opacity:n=.25,range:l=.1,steps:o=80,scale:s=[3,1.5,2.2]}=i,d=st(e,t),h=new Ee({glslVersion:Oe,uniforms:{base:{value:new Ae(a)},map:{value:d},cameraPos:{value:new f},threshold:{value:r},opacity:{value:n},range:{value:l},steps:{value:o},frame:{value:0}},vertexShader:rt,fragmentShader:nt,side:Pe,transparent:!0,depthWrite:!0}),m=new ee(new Ie(1,1,1),h);return m.name="volumeCloud",m.scale.set(...s),m.frustumCulled=!1,m}function ct(i,e,t=0){if(!i?.material?.uniforms||!e||!i.material.visible)return;const a=i.material.uniforms;e.getWorldPosition(a.cameraPos.value),a.frame.value+=1,t!==0&&(i.rotation.y+=t/60)}function dt(i){i&&(i.geometry?.dispose(),i.material?.uniforms?.map?.value?.dispose(),i.material?.dispose())}let c;const p=new He;let w,g,L,U,x=null,D=null,O=null,E=null,_=null,k=null,G=[];const N=[new f(20.94,3.7,14.89),new f(-1.32,7.65,14.83),new f(-19.85,14.38,8.77)],Q=N.slice(0,-1).map((i,e)=>({from:i,to:N[e+1],length:i.distanceTo(N[e+1])})),he=Q.reduce((i,e)=>i+e.length,0),_e=new Te;let v=1,u=null,j=!1,y=null;const T={maxFar:30,lightNear:.1,lightFar:50,lightMargin:30,lightIntensity:10},me=new Je,fe=new Se,ht="./glb/crash_junction.glb",b=new f(21.5,4,15);function mt(i,e=.18){const t=Math.min(Math.max(e,.001),.49),a=1/(1-t);return i<t?a*i*i/(2*t):i>1-t?1-a*(1-i)*(1-i)/(2*t):a*(i-t/2)}function ft(i,e){if(!Q.length||he<=0)return;let t=e*he;for(const a of Q){if(t<=a.length){i.position.lerpVectors(a.from,a.to,t/a.length);return}t-=a.length}i.position.copy(N[N.length-1])}const W={josh:{url:"./glb/josh.glb",scale:.001,idleAnim:"idle1",walkAnim:"walk",runAnim:"run",jumpAnim:"jump",flyAnim:"flying",flyIdleAnim:"flyidle",enterCarAnim:"enterCar",exitCarAnim:"exitCar",headBoneName:"mixamorigHead",rotateY:Math.PI},maw:{url:"./glb/maw.glb",scale:.005,idleAnim:"idle",walkAnim:"walk",runAnim:"run",jumpAnim:"jump",flyAnim:"flying",flyIdleAnim:"flyidle",enterCarAnim:"enterCar",exitCarAnim:"exitCar",headBoneName:"mixamorigHead",rotateY:Math.PI},ual:{url:"./glb/ual.glb",scale:.001,idleAnim:"Idle_Loop",walkAnim:"Walk_Loop",runAnim:"Sprint_Loop",jumpAnim:["Jump_Start","Jump_Loop","Jump_Land"],flyAnim:"fly",flyIdleAnim:"flyIdle",flyHoverForwardAnim:"flyHoverForward",flyHoverBackAnim:"flyHoverBack",flyHoverLeftAnim:"flyHoverLeft",flyHoverRightAnim:"flyHoverRight",flyHoverUpAnim:"flyHoverUp",flyHoverDownAnim:"flyHoverDown",headBoneName:"Head",rotateY:Math.PI,firstPersonCameraOffset:[0,.15,.12]}},pe={url:"./glb/sedan.glb",scale:.09,wheelsNames:["Wheel_LF","Wheel_RF","Wheel_LR","Wheel_RR"],boardingPoint:new f(.6,0,2),seatOffset:new f(.35,.65,-.1),chassisRatio:.35,suspensionRestLengthRatio:.2};St();function R(i){if(!i||!E)return;(Array.isArray(i)?i:[i]).forEach(t=>E.setupMaterial(t))}function ve(i,e){const t=new at({maxFar:T.maxFar*e,cascades:3,mode:"practical",parent:p,shadowMapSize:i,shadowBias:-1e-5,lightDirection:new f(-1,-2,-1).normalize(),lightIntensity:T.lightIntensity,lightNear:T.lightNear*e,lightFar:T.lightFar*e,camera:w,fade:!0,lightMargin:T.lightMargin*e});return t.lights.forEach((a,r)=>{const n=Math.pow(2,r);a.shadow.bias=-1e-4*n,a.shadow.normalBias=.002*n}),t}function pt(i){E.remove(),E.dispose();const e=g.capabilities.maxTextureSize;E=ve(Math.min(2048,e),i),p.traverse(t=>{t.isMesh&&R(t.material)})}function $(i){const e=W[i];return{...e,scale:e.scale*v}}function ge({position:i,radius:e=.16,cloudScale:t=[.32,.15,.32],motion:a=null}){const r=new ee(new Ze(e,32),new Ye({color:8965375,transparent:!0,opacity:.7,metalness:0,roughness:.5,side:qe}));r.position.copy(i),r.rotation.x=-Math.PI/2,r.material.visible=!1,p.add(r),c.addDynamicCollider(r);const n=lt({scale:t,opacity:.28,steps:80});n.position.set(0,0,0),n.rotation.x=Math.PI/2,r.add(n);const l={mesh:r,cloud:n,basePosition:i.clone(),motion:a};return G.push(l),l}function gt(){const i=_e.getElapsed();G.forEach(e=>{const{mesh:t,basePosition:a,motion:r,cloud:n}=e;if(r){if(r.axis==="y"){t.position.copy(a);const l=Math.sin(i*r.speed)*r.distance;t.position.y=a.y+l+r.distance}else if(r.axis==="x"&&c.getActiveDynamicCollider()?.source===t&&c.getIsOnGround()){e.motionElapsed=(e.motionElapsed??0)+c.getCurrentDelta();const l=e.motionElapsed*r.speed/Math.PI%2,o=l<=1?l:2-l,s=mt(o);ft(t,s)}}ct(n,w)})}function ut(){G.forEach(({mesh:i,cloud:e})=>{c?.removeDynamicCollider(i),dt(e),p.remove(i)}),G=[]}async function St(){const i=document.querySelector("#container");g=new Ue({antialias:!0}),g.setSize(i.clientWidth,i.clientHeight),g.shadowMap.enabled=!1,g.toneMapping=Fe,g.toneMappingExposure=1,g.setAnimationLoop(yt),i.appendChild(g.domElement),w=new ke(60,i.clientWidth/i.clientHeight,.01,1e3),w.position.copy(b),w.lookAt(b.x,b.y,b.z+1),L=new et(w,g.domElement),L.enableDamping=!0,L.maxDistance=2e3,L.dampingFactor=.1,L.rotateSpeed=1,L.maxPolarAngle=Math.PI/2,L.target.set(b.x,b.y,b.z+1);const e=g.capabilities.maxTextureSize,t=Math.min(2048,e);E=ve(t,1),E.lights.forEach((s,d)=>{const h=Math.pow(2,d);s.shadow.bias=-1e-4*h,s.shadow.normalBias=.002*h});const a=new Ge(16777215,5);p.add(a),new Ke().load("./img/env.hdr",s=>{s.mapping=Be,p.background=s},void 0,s=>console.warn("HDR 加载失败：",s)),O=new Ve,Object.assign(O.dom.style,{position:"fixed",bottom:"0",left:"0",top:"auto",zIndex:"9998"}),document.body.appendChild(O.dom);const r=new je(.05,16,16),n=new We({color:65535,opacity:.8,transparent:!0,depthTest:!1});D=new ee(r,n),D.visible=!1,D.renderOrder=999,p.add(D),wt(),await ye(ht),g.render(p,w),c=new we,await c.init({scene:p,camera:w,controls:L,playerModelConfig:W.josh,initPos:b,minCamDistance:50,maxCamDistance:220,enableOverShoulderView:!1});const l=c.getPlayerModel();l&&(_=new Le(l),_.visible=!1,p.add(_));const o=ge({position:new f(22,2.76,9.7),motion:{axis:"y",distance:4,speed:.5}});o.mesh,o.cloud,ge({position:N[0],motion:{axis:"x",distance:3,speed:.1}}),c.getPlayerModel()?.traverse(s=>{s.isMesh&&(s.castShadow=!0,s.receiveShadow=!0,R(s.material))}),Ct(),window.addEventListener("resize",Dt,!1),window.hideLoader()}function wt(){U=new ze;const i=new Xe;i.setDecoderPath("https://unpkg.com/three@0.180.0/examples/jsm/libs/draco/"),U.setDRACOLoader(i);const e=new Qe;e.setTranscoderPath("https://unpkg.com/three@0.180.0/examples/jsm/libs/basis/"),e.detectSupport(g),U.setKTX2Loader(e)}async function ye(i,e=[10,10,10]){try{const a=(await U.loadAsync(i)).scene;a.name="sceneGLB",a.scale.set(...e),a.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0,R(r.material))}),p.add(a)}catch(t){console.error("GLB 加载失败：",t)}}async function Lt(i){const e=URL.createObjectURL(i);document.pointerLockElement&&await new Promise(a=>{document.addEventListener("pointerlockchange",a,{once:!0}),document.exitPointerLock()});const t=p.getObjectByName("sceneGLB");t&&(t.traverse(a=>{a.isMesh&&(a.geometry?.dispose(),(Array.isArray(a.material)?a.material:[a.material]).forEach(n=>n?.dispose()))}),p.remove(t)),ut(),c?.destroy(),c=null,await ye(e,[1,1,1]),k&&URL.revokeObjectURL(k),k=e,await _t(x?.playerModel??"josh")}async function _t(i){j=!0;const e=W[i];if(u=(await U.loadAsync(e.url)).scene,u.scale.setScalar(e.scale*v),u.visible=!1,u.traverse(a=>{a.isMesh&&(Array.isArray(a.material)?a.material:[a.material]).forEach(n=>{n.transparent=!0,n.opacity=.5,n.depthWrite=!1})}),p.add(u),y){const a=y.querySelector("input[type=range]"),r=y.querySelector("span:last-child");a&&(a.value=String(Math.log10(v))),r&&(r.textContent=v.toFixed(2))}else{y=document.createElement("div"),Object.assign(y.style,{position:"fixed",bottom:"20px",left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.65)",color:"#fff",padding:"12px 24px",borderRadius:"8px",fontSize:"14px",zIndex:"9999",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"});const a=document.createElement("span");a.textContent="移动鼠标预览人物位置 · 双击确认放置";const r=document.createElement("div");Object.assign(r.style,{display:"flex",alignItems:"center",gap:"8px"});const n=document.createElement("span");n.textContent="人物比例：";const l=document.createElement("input");l.type="range",l.min="-2",l.max="3",l.step="0.01",l.value=String(Math.log10(v)),l.style.width="160px";const o=document.createElement("span");o.textContent=v.toFixed(2),l.addEventListener("input",()=>{v=Math.pow(10,parseFloat(l.value)),o.textContent=v.toFixed(2),u&&u.scale.setScalar(e.scale*v)}),r.append(n,l,o),y.append(a,r),document.body.appendChild(y)}y.style.display="flex",g.domElement.addEventListener("mousemove",Me),g.domElement.addEventListener("dblclick",De)}function vt(){j=!1,L.enableZoom=!0,u&&(u.traverse(i=>{i.isMesh&&(i.geometry?.dispose(),(Array.isArray(i.material)?i.material:[i.material]).forEach(t=>t?.dispose()))}),p.remove(u),u=null),y&&(y.style.display="none"),g.domElement.removeEventListener("mousemove",Me),g.domElement.removeEventListener("dblclick",De)}function Me(i){if(!j||!u)return;fe.set(i.clientX/window.innerWidth*2-1,-(i.clientY/window.innerHeight)*2+1),me.setFromCamera(fe,w);const e=p.getObjectByName("sceneGLB");if(!e)return;const t=me.intersectObject(e,!0);t.length>0?(u.position.copy(t[0].point),u.visible=!0):u.visible=!1}async function De(){if(!j||!u?.visible)return;const i=u.position.clone(),e=$(x?.playerModel??"josh");i.y+=180*e.scale*.75,vt(),pt(v),c=new we,await c.init({scene:p,camera:w,controls:L,playerModelConfig:$(x?.playerModel??"josh"),initPos:i,minCamDistance:50,maxCamDistance:220,colliderMeshUrl:k,enableOverShoulderView:x?.enableOverShoulderView??!0,camOverShoulderOffsetRatio:x?.camOverShoulderOffsetRatio??.2,thirdMouseMode:x?.thirdMouseMode??1}),c.getPlayerModel()?.traverse(t=>{t.isMesh&&(t.castShadow=!0,t.receiveShadow=!0,R(t.material))})}function yt(i){_e.update(i),c?(c.update(),Mt()):L.update(),gt(),E?.update(),g.render(p,w),O?.update()}function Mt(){if(!x?.centerRaycast)return;const i=c.getCenterScreenRaycastHit();i?(D.position.copy(i.point),D.visible=!0):D.visible=!1}function Dt(){w.aspect=window.innerWidth/window.innerHeight,g.setSize(window.innerWidth,window.innerHeight),w.updateProjectionMatrix(),g.setPixelRatio(window.devicePixelRatio*1)}function Ct(){const i=new $e({title:"Debug Panel",width:280});Object.assign(i.domElement.style,{position:"fixed",top:"12px",right:"12px",zIndex:"9999"}),["pointerdown","mousedown","click"].forEach(o=>{i.domElement.addEventListener(o,s=>s.stopPropagation())});const e=document.createElement("input");e.type="file",e.accept=".gltf,.glb",e.style.display="none",document.body.appendChild(e),e.addEventListener("change",async o=>{const s=o.target.files?.[0];s&&(await Lt(s),e.value="")}),i.add({upload:()=>e.click()},"upload").name("Change Scene (.glb/.gltf)");const t={playerModel:"josh",showFPS:!0,showShadow:!1,mouseSensitivity:5,gravity:-2400,jumpHeight:600,playerSpeed:300,flySpeed:2100,playerAcceleration:30,playerDeceleration:30,timeScale:1,minCamDistance:50,maxCamDistance:220,camLookAtHeightRatio:.8,enableSpringCamera:!1,springCameraTime:.05,thirdMouseMode:1,enableZoom:!1,debug:!1,enableOverShoulderView:!1,camOverShoulderOffsetRatio:.2,centerRaycast:!1,showSkeleton:!1,pathPlannerDebug:!1},a={...t},r=o=>{c.getAllVehicles().forEach(s=>{s.pathPlanner?.updateConfig({debugEnabled:o}),o||s.pathPlanner?.clearVisualization()})},n=i.add({spawn:async()=>{if(c.getAllVehicles().length>=5){alert("For performance reasons, the demo supports a maximum of 5 vehicles.");return}const o=c.getPosition(),s=new f;w.getWorldDirection(s),s.y=0,s.normalize();const d=o.clone().addScaledVector(s,.5);d.y=o.y,await c.loadVehicleModel({...pe,scale:pe.scale*v,position:d});const h=c.getAllVehicles().at(-1);h?.pathPlanner?.updateConfig({debugEnabled:t.pathPlannerDebug}),h?.vehicleGroup?.traverse(m=>{m.isMesh&&(m.castShadow=!0,m.receiveShadow=!0,R(m.material),m.material.metalness=.8,m.material.roughness=0)})}},"spawn").name("Spawn Vehicle");["pointerdown","mousedown","click"].forEach(o=>{n.domElement.addEventListener(o,s=>s.stopPropagation())}),i.add(t,"playerModel",Object.keys(W)).name("Player Model").onChange(async o=>{await c.switchPlayerModel($(o)),c.getPlayerModel()?.traverse(d=>{d.isMesh&&(d.castShadow=!0,d.receiveShadow=!0,R(d.material),o=="ual"&&(d.material.metalness=.8,d.material.roughness=0))}),_&&(p.remove(_),_.dispose());const s=c.getPlayerModel();s&&(_=new Le(s),_.visible=t.showSkeleton,p.add(_))}),i.add(t,"showFPS").name("Show FPS").onChange(o=>O.dom.style.display=o?"block":"none"),i.add(t,"showShadow").name("Show Shadow").onChange(o=>{g.shadowMap.enabled=o,p.traverse(s=>{s.isMesh&&(s.material.needsUpdate=!0)})}),i.add(t,"mouseSensitivity",1,20,.1).onChange(o=>c.setMouseSensitivity(o)),i.add(t,"gravity",-6e3,0,50).onChange(o=>c.setGravity(o)),i.add(t,"jumpHeight",0,2e3,10).onChange(o=>c.setJumpHeight(o)),i.add(t,"playerSpeed",0,1e4,10).onChange(o=>c.setPlayerSpeed(o)),i.add(t,"flySpeed",0,5e3,10).onChange(o=>c.setPlayerFlySpeed(o)),i.add(t,"playerAcceleration",1,100,1).name("Acceleration").onChange(o=>c.playerAcceleration=o),i.add(t,"playerDeceleration",1,100,1).name("Deceleration").onChange(o=>c.playerDeceleration=o),i.add(t,"timeScale",0,3,.05).name("Time Scale").onChange(o=>c.timeScale=o),i.add(t,"minCamDistance",0,200,1).onChange(o=>c.setMinCamDistance(o)),i.add(t,"maxCamDistance",50,1e3,1).onChange(o=>c.setMaxCamDistance(o)),i.add(t,"camLookAtHeightRatio",0,1,.01).onChange(o=>c.setCamLookAtHeightRatio(o)),i.add(t,"camOverShoulderOffsetRatio",-1,1,.01).onChange(o=>c.setCamOverShoulderOffsetRatio(o)),i.add(t,"enableSpringCamera").name("Spring Camera").onChange(o=>c.cam.enableSpringCamera=o),i.add(t,"springCameraTime",.01,1,.01).name("Spring Time").onChange(o=>c.cam.springCameraTime=o),i.add(t,"thirdMouseMode",{0:0,1:1,2:2,3:3,4:4,5:5}).onChange(o=>c.setThirdMouseMode(Number(o))),i.add(t,"enableZoom").onChange(o=>c.setEnableZoom(o)),i.add(t,"debug").onChange(o=>c.setDebug(o)),i.add(t,"pathPlannerDebug").name("Path Planner Debug").onChange(o=>r(o)),i.add(t,"enableOverShoulderView").onChange(o=>c.setOverShoulderView(o)),i.add(t,"centerRaycast").name("Center Raycast Debug").onChange(o=>{o||(D.visible=!1)}),i.add(t,"showSkeleton").name("Show Skeleton").onChange(o=>{_&&(_.visible=o)});const l=i.add({resetToDefault:()=>{Object.assign(t,a),i.controllers.forEach(o=>o.updateDisplay()),i.folders.forEach(o=>o.controllers.forEach(s=>s.updateDisplay())),c.setMouseSensitivity(a.mouseSensitivity),c.setGravity(a.gravity),c.setJumpHeight(a.jumpHeight),c.setPlayerSpeed(a.playerSpeed),c.setPlayerFlySpeed(a.flySpeed),c.timeScale=a.timeScale,c.setMinCamDistance(a.minCamDistance),c.setMaxCamDistance(a.maxCamDistance),c.setThirdMouseMode(a.thirdMouseMode),c.setEnableZoom(a.enableZoom),c.setDebug(a.debug),r(a.pathPlannerDebug),c.setOverShoulderView(a.enableOverShoulderView),c.setCamOverShoulderOffsetRatio(a.camOverShoulderOffsetRatio),D.visible=!1,O&&(O.dom.style.display="none")}},"resetToDefault").name("Reset to Default");["pointerdown","mousedown","click"].forEach(o=>{l.domElement.addEventListener(o,s=>s.stopPropagation())}),x=t}
