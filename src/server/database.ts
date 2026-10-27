/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  WeedRemedyProfile,
  TrainingImageRecord,
  DetectionResult,
  FieldInfo,
  DensityPoint,
  WeedSpecies,
} from '../types/index.ts';

// Comprehensive Agronomic Weed Remedies Database
export const REMEDIES_DATABASE: Record<WeedSpecies, WeedRemedyProfile> = {
  pigweed: {
    speciesId: 'pigweed',
    commonName: 'Redroot Pigweed',
    scientificName: 'Amaranthus retroflexus',
    family: 'Amaranthaceae',
    lifecycle: 'Annual',
    weedType: 'Broadleaf',
    threatLevel: 'Severe',
    typicalCropsAffected: ['Corn', 'Soybean', 'Cotton', 'Sorghum', 'Vegetable Crops'],
    germinationConditions: 'Warm soil (>65°F / 18°C), shallow soil depth (0.5 to 2.5 cm), requires sunlight trigger.',
    identificationTips: [
      'Rough, hairy stems with reddish-purple tint near soil line',
      'Broad, ovate-shaped leaves with distinct lighter green veins',
      'Dense, bristly, spike-like terminal flower clusters',
      'Single plant can produce up to 100,000–250,000 viable seeds',
    ],
    remedies: [
      {
        category: 'organic',
        title: 'High-Carbon Organic Mulching & Solarization',
        description: 'Smother seedling emergence using 4–6 inches of cereal rye straw or bio-plastic solarization film.',
        instructions: [
          'Spread thick straw mulch immediately post-planting before weed emergence.',
          'Solarize empty plots using clear UV-stabilized 6-mil polyethylene for 4–6 weeks during peak midsummer sun.',
          'Use precision flame weeding when pigweed is in the 2–4 leaf cotyledon stage.',
        ],
        timing: 'Pre-emergence and early seedling stage (< 2 inches tall)',
        efficacy: 88,
        safetyNote: 'Ensure soil moisture is adequate before solarization to maximize thermal conductivity.',
      },
      {
        category: 'cultural',
        title: 'Narrow Row Spacing & Stale Seedbed Technique',
        description: 'Accelerate crop canopy closure to deprive pigweed seedlings of the sunlight needed for germination.',
        instructions: [
          'Reduce corn/soy row spacing from 30 inches to 15 or 20 inches to induce rapid canopy shade.',
          'Prepare seedbed 14 days before planting, allow pigweed flush, then perform shallow tine weeding without turning deep soil.',
          'Integrate winter cereal rye cover crop (drilled at 60–80 lbs/acre) terminated with roller-crimper.',
        ],
        timing: 'Pre-season seedbed preparation and planting configuration',
        efficacy: 84,
        safetyNote: 'Avoid deep tillage which brings dormant buried seeds to the surface germination zone.',
      },
      {
        category: 'chemical',
        title: 'Layered Pre- & Post-Emergence Herbicide Program',
        description: 'Two-pass chemical control targeting HPPD inhibitors and PPO inhibitors to prevent glyphosate-resistant strains.',
        instructions: [
          'Pass 1 (Pre-emergence): Apply S-metolachlor + Sulfentrazone or Fomesafen within 48 hours of planting.',
          'Pass 2 (Early Post-emergence): Apply Mesotrione (3.0 fl oz/acre) + Atrazine (0.5 lb a.i./acre) with 1% v/v COC adjuvant when weeds are under 3 inches tall.',
          'Clean spray rig between fields to prevent moving resistant seed heads.',
        ],
        timing: 'Pre-emergence followed by post-emergence spray when weeds are < 3 inches tall',
        efficacy: 96,
        activeIngredients: 'S-metolachlor (1.33 pt/acre) + Mesotrione (3 oz/acre)',
        dosage: '1.33 pt/acre (Pre) / 3.0 fl oz/acre (Post)',
        safetyNote: 'Wear PPE (chemical-resistant gloves, eye goggles, respirator). Maintain 50-ft aquatic buffer zone.',
      },
      {
        category: 'preventive',
        title: 'Zero-Tolerance Harvest Seed Weed Elimination',
        description: 'Prevent seed rain by hand-rogueing mature escapees prior to combine harvesting.',
        instructions: [
          'Rogue surviving pigweed escapes in late August before seed set.',
          'Utilize harvest weed seed control (HWSC) mill attachment on combine harvester to pulverize 98% of captured seeds.',
        ],
        timing: 'Late reproductive phase (August - October)',
        efficacy: 92,
      },
    ],
    bestSprayWindow: 'Early morning (06:00 - 09:30 AM) with calm winds (< 8 mph) and relative humidity > 55%.',
    environmentalCaution: 'Avoid application if rain is expected within 2 hours or if adjacent to open waterways.',
  },

  crabgrass: {
    speciesId: 'crabgrass',
    commonName: 'Large Crabgrass',
    scientificName: 'Digitaria sanguinalis',
    family: 'Poaceae',
    lifecycle: 'Annual',
    weedType: 'Grassy',
    threatLevel: 'Moderate',
    typicalCropsAffected: ['Corn', 'Sorghum', 'Turfgrass', 'Vegetables', 'Orchards'],
    germinationConditions: 'Germinates when soil temperature at 2-inch depth reaches 55°F (13°C) for 3 consecutive days.',
    identificationTips: [
      'Prostrate spreading growth with stems rooting at lower nodes',
      'Broad, light green to yellowish-green leaf blades with hairy sheaths',
      'Finger-like seed spikes (3–7 radiating racemes at stem apex)',
      'Thrives in high-light, compacted, low-calcium soils',
    ],
    remedies: [
      {
        category: 'organic',
        title: 'Corn Gluten Meal (CGM) Bio-Herbicidal Pre-Emergent',
        description: 'Natural corn by-product containing inhibitory dipeptides that inhibit root development in germinating crabgrass.',
        instructions: [
          'Broadcast 20 lbs per 1,000 sq ft of pelletized corn gluten meal in early spring before soil reaches 55°F.',
          'Water gently with 1/4 inch of water, then allow a 48-hour dry period for root desiccation.',
          'Follow with high-mowing regime (3.5 to 4 inches) to shade out late germinators.',
        ],
        timing: 'Early spring when Forsythia blooms (soil temperature 50–55°F)',
        efficacy: 78,
        safetyNote: 'Do not use if seeding desirable companion grasses concurrently.',
      },
      {
        category: 'cultural',
        title: 'Aeration & High-Canopy Competition',
        description: 'Alleviate soil compaction and promote dense crop/turf canopy cover.',
        instructions: [
          'Core-aerate compacted soil zones in autumn to boost root aeration and drainage.',
          'Maintain tall crop canopy or turf mowing height at 3.5 inches minimum.',
          'Avoid light, frequent overhead watering; switch to deep, infrequent irrigation.',
        ],
        timing: 'Autumn soil conditioning and active spring growing season',
        efficacy: 82,
      },
      {
        category: 'chemical',
        title: 'Dinitroaniline Pre-Emergent + Selective Post-Graminicide',
        description: 'Form a chemical barrier in the top half-inch of soil, supplemented by selective grass herbicides.',
        instructions: [
          'Apply Pendimethalin (e.g., Prowl H2O at 2.0–3.0 pt/acre) or Prodiamine prior to crabgrass emergence.',
          'For post-emergence escapes, apply Clethodim (Select Max at 9–12 fl oz/acre) or Quinclorac (for turf/corn) before crabgrass reaches 3-tiller stage.',
        ],
        timing: 'Pre-emergence barrier in early spring; post-emergence at 1-3 leaf stage',
        efficacy: 94,
        activeIngredients: 'Pendimethalin (Pre) / Clethodim or Quinclorac (Post)',
        dosage: '2.5 pt/acre (Pre) / 10 fl oz/acre (Post)',
        safetyNote: 'Do not spray during extreme heat (> 90°F) to avoid crop leaf burn.',
      },
    ],
    bestSprayWindow: 'Mid-morning on calm days, 24 hours prior to light rain or irrigation for incorporation.',
    environmentalCaution: 'Pendimethalin is moderately toxic to fish; maintain 100-ft vegetative filter strips.',
  },

  lambsquarters: {
    speciesId: 'lambsquarters',
    commonName: 'Common Lambsquarters',
    scientificName: 'Chenopodium album',
    family: 'Amaranthaceae',
    lifecycle: 'Annual',
    weedType: 'Broadleaf',
    threatLevel: 'Moderate',
    typicalCropsAffected: ['Soybean', 'Sugar Beet', 'Corn', 'Potatoes', 'Cereals'],
    germinationConditions: 'Early spring flush at cool temperatures (40–50°F / 5–10°C); capable of emerging from deeper soil horizons.',
    identificationTips: [
      'Whitish, mealy, powdery coating on underside of young leaves and shoot tips',
      'Goosefoot-shaped leaves with wavy-toothed margins',
      'Stems grooved with reddish or pinkish stripes',
      'High competitor for nitrogen and soil moisture',
    ],
    remedies: [
      {
        category: 'organic',
        title: 'Horticultural Vinegar (20% Acetic Acid) Burn-Down Spray',
        description: 'Non-selective bio-contact desiccant that strips protective wax layers on young lambsquarters.',
        instructions: [
          'Mix 20% organic horticultural acetic acid with 1 tbsp orange oil or d-limonene per gallon as adjuvant.',
          'Direct spray onto young seedlings under 2 inches tall on a hot, sunny day (>75°F).',
          'Use hooded sprayer to protect adjacent crop foliage.',
        ],
        timing: 'Warm sunny mid-day on 2–4 leaf seedlings',
        efficacy: 85,
        safetyNote: 'Extremely caustic to human skin and eyes; use face shield, neoprene gloves, and acid-rated respirator.',
      },
      {
        category: 'cultural',
        title: 'Early Rotary Hoeing & Blind Cultivation',
        description: 'Uproot white-thread stage seedlings before they establish root reserves.',
        instructions: [
          'Run a rotary hoe or flex-tine weeder at 8–10 mph 4 to 7 days after crop planting.',
          'Execute during hot afternoon hours when crop seedlings are pliable and weed seedlings desiccate instantly.',
        ],
        timing: 'Seedling white-thread to 2-leaf stage',
        efficacy: 89,
      },
      {
        category: 'chemical',
        title: 'Dicamba / Thifensulfuron-methyl Selective Broadleaf Control',
        description: 'Penetrates mealy wax coating to achieve systemic translocation to the root meristem.',
        instructions: [
          'Apply Dicamba (0.5 pt/acre) or Thifensulfuron + Flumioxazin before lambsquarters exceeds 4 inches in height.',
          'Add methylated seed oil (MSO) or non-ionic surfactant (NIS) to enhance cuticle penetration through the mealy powder.',
        ],
        timing: 'Post-emergence when weeds are 2–4 inches tall',
        efficacy: 95,
        activeIngredients: 'Dicamba / Flumioxazin / Thifensulfuron',
        dosage: '8–16 fl oz/acre depending on crop formulation',
        safetyNote: 'Strictly check drift reduction technology (DRT) nozzles and wind direction to prevent off-target drift to non-tolerant crops.',
      },
    ],
    bestSprayWindow: 'Warm afternoons with active weed photosynthesis for maximum systemic uptake.',
    environmentalCaution: 'High risk of vapor drift under thermal inversion; do not apply when air temperature exceeds 85°F.',
  },

  nutsedge: {
    speciesId: 'nutsedge',
    commonName: 'Yellow Nutsedge',
    scientificName: 'Cyperus esculentus',
    family: 'Cyperaceae',
    lifecycle: 'Perennial',
    weedType: 'Sedge',
    threatLevel: 'Severe',
    typicalCropsAffected: ['Corn', 'Soybean', 'Cotton', 'Rice', 'Turf', 'Horticultural Crops'],
    germinationConditions: 'Underground tubers (nutlets) sprout in late spring as soils warm (>65°F). Thrives in poorly drained, waterlogged fields.',
    identificationTips: [
      'Triangular stem in cross section ("sedges have edges")',
      'Glossy, waxy, yellow-green leaves with long tapered tips',
      'Golden-yellow spiketlets in umbel clusters',
      'Forms extensive rhizome network with basal bulbs and dormant tubers up to 12 inches deep',
    ],
    remedies: [
      {
        category: 'cultural',
        title: 'Subsurface Drainage Tile & Compaction Alleviation',
        description: 'Yellow nutsedge is an indicator of poor soil drainage. Remedying waterlogging deprives it of competitive advantage.',
        instructions: [
          'Install or repair perforated field drainage tiles in low-lying swampy depressions.',
          'Subsoil or chisel plow during dry periods to shatter subsurface hardpans.',
          'Rotate with dense competitive smother crops like Sudangrass or Sorghum.',
        ],
        timing: 'Post-harvest dry autumn periods',
        efficacy: 80,
      },
      {
        category: 'organic',
        title: 'Repeated Tillage Desiccation & Swine/Poultry Foraging',
        description: 'Expose subterranean tubers to hot surface winds and solar desiccation.',
        instructions: [
          'Cultivate every 10–14 days during dry summer fallow to bring tubers to top 2 inches of soil.',
          'Allow high sun exposure to desiccate tubers below 15% moisture content.',
          'Run heritage pigs or poultry on fallow ground to root out and consume nutrient-rich nutlets.',
        ],
        timing: 'Mid-summer dry spells during crop fallow',
        efficacy: 76,
      },
      {
        category: 'chemical',
        title: 'Halosulfuron-methyl / Sulfentrazone Specialized Sedge Control',
        description: 'Inhibits acetolactate synthase (ALS) enzyme in tubers and stops basal bulb reproduction.',
        instructions: [
          'Apply Halosulfuron-methyl (Sandea / SedgeHammer at 0.75 to 1.0 oz/acre) when nutsedge has 3–8 leaves.',
          'Add non-ionic surfactant (NIS) at 0.25% v/v.',
          'Second application may be required 30 days later for secondary flushes from dormant tubers.',
        ],
        timing: 'Active growth at 3–8 leaf stage before tuber formation (June–July)',
        efficacy: 92,
        activeIngredients: 'Halosulfuron-methyl (75% WG)',
        dosage: '0.75 – 1.0 oz/acre (1.5–2.0 grams per 1,000 sq ft)',
        safetyNote: 'Follow rotational crop restrictions (10–18 months for sensitive vegetables).',
      },
    ],
    bestSprayWindow: 'Between 10:00 AM and 03:00 PM when sedges are transpiring actively.',
    environmentalCaution: 'Halosulfuron is mobile in high-pH sandy soils; do not exceed label rates near shallow groundwater.',
  },

  foxtail: {
    speciesId: 'foxtail',
    commonName: 'Green Foxtail',
    scientificName: 'Setaria viridis',
    family: 'Poaceae',
    lifecycle: 'Annual',
    weedType: 'Grassy',
    threatLevel: 'Moderate',
    typicalCropsAffected: ['Corn', 'Wheat', 'Barley', 'Soybean', 'Canola'],
    germinationConditions: 'Warm soil flush (60–75°F); rapid germination within 48 hours of rain event.',
    identificationTips: [
      'Dense, cylindrical, erect or slightly nodding bottle-brush seed head',
      'Hairless leaf blades with ligule composed of a fringe of hairs',
      'Forms prolific tillers and seed heads even when mowed down',
      'Seeds can survive in soil bank up to 3 years',
    ],
    remedies: [
      {
        category: 'cultural',
        title: 'Delayed Seeding & Pre-Plant Flush Cultivation',
        description: 'Trigger the main foxtail germination flush before planting spring cereals.',
        instructions: [
          'Delay cereal crop seeding by 7–10 days in heavily infested fields.',
          'Perform high-speed shallow harrowing to destroy emerged foxtail flushes.',
          'Increase crop seeding rate by 15–20% to foster rapid ground shade.',
        ],
        timing: 'Spring pre-planting window',
        efficacy: 84,
      },
      {
        category: 'chemical',
        title: 'Selective Graminicides & Acetamide Residuals',
        description: 'Dual barrier prevention followed by selective ACCase enzyme inhibitors.',
        instructions: [
          'Apply Acetochlor (Warrant) or Pyroxasulfone (Zidua) pre-emergence.',
          'Post-emergence in broadleaf crops: apply Quizalofop-p-ethyl (Assure II at 7–9 fl oz/acre) or Fenoxaprop.',
          'For corn: apply Nicosulfuron or Rimsulfuron when foxtail is 1–4 inches tall.',
        ],
        timing: 'Pre-emergence incorporated, or post-emergence at 2–4 leaf stage',
        efficacy: 94,
        activeIngredients: 'Pyroxasulfone / Quizalofop-p-ethyl',
        dosage: '1.5–3.0 oz/acre depending on soil organic matter',
        safetyNote: 'Do not tank-mix ACCase graminicides with broadleaf herbicides without checking antagonistic compatibility.',
      },
      {
        category: 'organic',
        title: 'Heavy Cereal Rye Cover Crop Roller-Crimping',
        description: 'Allelopathic exudates from dense cereal rye mulch suppress foxtail emergence.',
        instructions: [
          'Establish winter cereal rye in fall with >4,000 lbs/acre dry biomass.',
          'Roller-crimp at rye anthesis to create a continuous weed-suppressive carpet.',
        ],
        timing: 'Fall establishment; spring roller-crimping',
        efficacy: 86,
      },
    ],
    bestSprayWindow: 'Morning spray before wind speeds increase above 7 mph.',
    environmentalCaution: 'Avoid drift into non-target grassy wetlands or prairie buffers.',
  },

  dandelion: {
    speciesId: 'dandelion',
    commonName: 'Common Dandelion',
    scientificName: 'Taraxacum officinale',
    family: 'Asteraceae',
    lifecycle: 'Perennial',
    weedType: 'Broadleaf',
    threatLevel: 'Low',
    typicalCropsAffected: ['No-till Corn', 'Soybean', 'Forages', 'Alfalfa', 'Orchards', 'Turf'],
    germinationConditions: 'Spring and autumn seed dispersal via wind pappus; also regenerates from deep severed taproot pieces.',
    identificationTips: [
      'Basal rosette of deeply lobed, tooth-like leaves ("dent-de-lion")',
      'Hollow stem exuding milky white latex sap when broken',
      'Solitary bright yellow inflorescence maturing into globose white seed puff',
      'Strong, vertical taproot extending 6 to 18 inches into the subsoil',
    ],
    remedies: [
      {
        category: 'organic',
        title: 'Deep Mechanical Taproot Extraction & FeHEDTA Spray',
        description: 'Remove taproot below the regenerative crown zone or apply chelated iron bio-herbicide.',
        instructions: [
          'Use a notched taproot weeder to sever root at least 3–4 inches below soil line.',
          'For broadcast turf or orchard floor: apply chelated iron (FeHEDTA at 5 oz/gal) which selectively causes cellular oxidation in dandelions.',
          'Over-seed bare spots with high-competition perennial rye or Dutch white clover.',
        ],
        timing: 'Autumn when plants are translocating sugars to taproot storage',
        efficacy: 83,
      },
      {
        category: 'chemical',
        title: 'Autumn Translocating Systemic Herbicide Treatment',
        description: 'Capitalize on reverse sap flow in fall to draw systemic actives deep into taproot system.',
        instructions: [
          'Apply 2,4-D Amine + Dicamba + Mecoprop (3-way blend at 1.2–1.5 qt/acre) after the first light fall frost.',
          'Alternatively, in no-till burndown: apply Glyphosate (32 fl oz/acre) + 2,4-D LV4 in mid-October.',
        ],
        timing: 'Autumn (September – November) during active downward translocation',
        efficacy: 97,
        activeIngredients: '2,4-D + Dicamba + Triclopyr',
        dosage: '1.25 qt/acre',
        safetyNote: 'Do not spray near fruit trees or vineyards during active foliage season.',
      },
    ],
    bestSprayWindow: 'Sunny autumn afternoon after overnight dew has dried.',
    environmentalCaution: 'Beneficial for early pollinators; delay lawn treatments until primary bloom flush finishes if possible.',
  },

  bindweed: {
    speciesId: 'bindweed',
    commonName: 'Field Bindweed',
    scientificName: 'Convolvulus arvensis',
    family: 'Convolvulaceae',
    lifecycle: 'Perennial',
    weedType: 'Broadleaf',
    threatLevel: 'Severe',
    typicalCropsAffected: ['Wheat', 'Corn', 'Vineyards', 'Cotton', 'Legumes'],
    germinationConditions: 'Seeds have hard, impermeable coats surviving 20–50 years in soil; primary spread via extensive rhizome roots.',
    identificationTips: [
      'Twining and climbing vine with arrow-shaped leaves',
      'Trumpet or funnel-shaped flowers in white or pale pink (0.75–1 inch wide)',
      'Extensive lateral root systems extending up to 20 feet horizontally and 10–30 feet deep',
      'Chokes combine harvesters and tangles crop stalks causing severe lodging',
    ],
    remedies: [
      {
        category: 'cultural',
        title: 'Intensive Competitive Smother Cropping (Sudangrass / Alfalfa)',
        description: 'Deplete extensive root starch reserves through continuous shading and frequent cutting.',
        instructions: [
          'Plant dense forage alfalfa or Sorghum-Sudangrass for 3 consecutive years.',
          'Mow or harvest every 4–5 weeks to force bindweed to repeatedly exhaust underground root reserves.',
        ],
        timing: 'Multi-year perennial rotation',
        efficacy: 79,
      },
      {
        category: 'chemical',
        title: 'Auxin Mimic Systemic Herbicide at Full Bloom',
        description: 'Target herbicide application when bindweed is in full bloom and drawing maximum carbohydrates downward.',
        instructions: [
          'Apply Quinclorac (Facet L at 22–32 fl oz/acre) or Aminocyclopyrachlor in post-harvest wheat stubble.',
          'Alternatively apply Glyphosate (2.0 qt/acre) + 2,4-D Ester (1.0 pt/acre) at full flowering stage.',
          'Repeat spot spray next spring on new emergence.',
        ],
        timing: 'Full flower stage (mid-to-late summer) or post-harvest stubble',
        efficacy: 91,
        activeIngredients: 'Quinclorac (1.5 lb a.i./gal) / Glyphosate 5.4',
        dosage: '28 fl oz/acre',
        safetyNote: 'Do not cultivate field for 14 days following application to allow full root translocation.',
      },
    ],
    bestSprayWindow: 'Warm morning during full bloom flush with healthy, unstressed bindweed vines.',
    environmentalCaution: 'Residual actives can carry over in soil; observe 18-month rotational restrictions for beans/peas.',
  },

  barnyardgrass: {
    speciesId: 'barnyardgrass',
    commonName: 'Barnyardgrass',
    scientificName: 'Echinochloa crus-galli',
    family: 'Poaceae',
    lifecycle: 'Annual',
    weedType: 'Grassy',
    threatLevel: 'High',
    typicalCropsAffected: ['Rice', 'Corn', 'Soybean', 'Cotton', 'Sugarbeet'],
    germinationConditions: 'Requires wet soil or shallow standing water; germinates across wide temperature span (60–90°F).',
    identificationTips: [
      'Coarse upright grass with distinctly flattened reddish-purple stem bases',
      'Completely lacks ligule and auricles ("hairless collar" distinguishing trait)',
      'Branched, purplish panicle seed head with short or long stiff awns',
      'Heavy consumer of soil nitrogen (up to 80% of applied N fertilizer)',
    ],
    remedies: [
      {
        category: 'cultural',
        title: 'Water Management & Rapid Canopy Shading',
        description: 'For rice and irrigated crops, calibrate flood depth and plant high-tillering crop cultivars.',
        instructions: [
          'Maintain uniform 2–4 inch water flood in rice paddies within 5 days of seeding.',
          'Seed high-density competitive crop varieties to shade furrow channels.',
        ],
        timing: 'Early vegetative seedling window',
        efficacy: 81,
      },
      {
        category: 'chemical',
        title: 'Residual Chloracetamide + Propanil / Cyhalofop Spray',
        description: 'Pre-emergence barrier coupled with post-emergence contact grass killers.',
        instructions: [
          'Pre-emergence: apply Clomazone (Command at 1.0–1.3 pt/acre) or S-metolachlor.',
          'Post-emergence: apply Cyhalofop-butyl (Clincher at 13.5–15 fl oz/acre) or Florpyrauxifen-benzyl (Loyant) when weeds have 2–4 leaves.',
        ],
        timing: 'Pre-flood or 1–3 leaf stage',
        efficacy: 95,
        activeIngredients: 'Clomazone / Cyhalofop-butyl',
        dosage: '1.2 pt/acre Pre / 14 fl oz/acre Post',
        safetyNote: 'Follow strict spray buffer rules near sensitive crops (sweet potatoes, vegetables).',
      },
    ],
    bestSprayWindow: 'Early morning when relative humidity is high and wind is < 6 mph.',
    environmentalCaution: 'Avoid drainage of treated rice field water into local canals for 14 days after herbicide.',
  },
};

// Seed dataset of realistic training images with bounding box annotations
export const INITIAL_TRAINING_IMAGES: TrainingImageRecord[] = [
  {
    id: 'train-img-001',
    title: 'Redroot Pigweed in Emerged Corn Canopy',
    speciesId: 'pigweed',
    speciesName: 'Redroot Pigweed',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="%234A3E2D"/><rect x="0" y="0" width="640" height="480" fill="%233A3022" opacity="0.3"/><line x1="0" y1="120" x2="640" y2="120" stroke="%23332819" stroke-width="24"/><line x1="0" y1="280" x2="640" y2="280" stroke="%23332819" stroke-width="24"/><line x1="0" y1="420" x2="640" y2="420" stroke="%23332819" stroke-width="24"/><g transform="translate(60, 80)"><ellipse cx="0" cy="0" rx="30" ry="12" fill="%232E6930" transform="rotate(-25)"/><ellipse cx="0" cy="0" rx="35" ry="10" fill="%233E8940" transform="rotate(35)"/></g><g transform="translate(240, 70)"><ellipse cx="0" cy="0" rx="32" ry="11" fill="%232E6930" transform="rotate(-15)"/><ellipse cx="0" cy="0" rx="38" ry="12" fill="%233E8940" transform="rotate(25)"/></g><g transform="translate(480, 85)"><ellipse cx="0" cy="0" rx="34" ry="12" fill="%232E6930" transform="rotate(-30)"/><ellipse cx="0" cy="0" rx="36" ry="11" fill="%233E8940" transform="rotate(30)"/></g><g transform="translate(180, 195)"><ellipse cx="0" cy="0" rx="38" ry="22" fill="%23852020"/><ellipse cx="0" cy="0" rx="34" ry="18" fill="%234A7A40"/><path d="M-20,-10 Q0,-35 20,-10 Q10,15 -20,-10" fill="%233A6832"/><circle cx="0" cy="-5" r="8" fill="%239E2B2B"/><circle cx="-8" cy="8" r="6" fill="%232D5526"/><circle cx="10" cy="5" r="7" fill="%232D5526"/></g><g transform="translate(390, 220)"><ellipse cx="0" cy="0" rx="42" ry="24" fill="%238E2525"/><ellipse cx="0" cy="0" rx="36" ry="20" fill="%23528848"/><circle cx="-10" cy="-6" r="10" fill="%23A83232"/><circle cx="12" cy="7" r="9" fill="%2336632E"/></g><rect x="135" y="155" width="95" height="85" fill="none" stroke="%23EF4444" stroke-width="2" stroke-dasharray="4"/><text x="140" y="150" fill="%23EF4444" font-size="12" font-family="sans-serif" font-weight="bold">Pigweed: 0.98</text><rect x="340" y="175" width="105" height="95" fill="none" stroke="%23EF4444" stroke-width="2" stroke-dasharray="4"/><text x="345" y="170" fill="%23EF4444" font-size="12" font-family="sans-serif" font-weight="bold">Pigweed: 0.96</text></svg>',
    imageWidth: 640,
    imageHeight: 480,
    split: 'train',
    growthStage: 'Vegetative',
    soilType: 'Loam',
    cropContext: 'Corn',
    annotations: [
      { id: 'ann-1', class: 'pigweed', speciesId: 'pigweed', bbox: [135, 155, 230, 240], growthStage: 'Vegetative' },
      { id: 'ann-2', class: 'pigweed', speciesId: 'pigweed', bbox: [340, 175, 445, 270], growthStage: 'Vegetative' },
    ],
    dateAdded: '2026-09-12',
    verified: true,
    notes: 'Corn inter-row spacing test; high red pigmentation visible at stems.',
  },
  {
    id: 'train-img-002',
    title: 'Large Crabgrass Clump in Soybean Furrow',
    speciesId: 'crabgrass',
    speciesName: 'Large Crabgrass',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="%23554737"/><line x1="0" y1="160" x2="640" y2="160" stroke="%23433626" stroke-width="32"/><line x1="0" y1="360" x2="640" y2="360" stroke="%23433626" stroke-width="32"/><g transform="translate(140, 110)"><ellipse cx="-15" cy="0" rx="22" ry="16" fill="%232D6C35"/><ellipse cx="15" cy="0" rx="22" ry="16" fill="%232D6C35"/><ellipse cx="0" cy="-18" rx="20" ry="15" fill="%23388743"/></g><g transform="translate(420, 105)"><ellipse cx="-15" cy="0" rx="24" ry="16" fill="%232D6C35"/><ellipse cx="15" cy="0" rx="24" ry="16" fill="%232D6C35"/><ellipse cx="0" cy="-20" rx="22" ry="16" fill="%23388743"/></g><g transform="translate(280, 260)"><path d="M0,0 Q-45,-25 -70,-10 Q-50,-40 -20,-60 Q5,-70 30,-50 Q60,-35 75,-10 Q40,-25 0,0" fill="%23729F44" stroke="%23577D30" stroke-width="2"/><path d="M0,0 Q-30,25 -55,40 Q-20,35 10,45 Q40,35 60,20 Q20,15 0,0" fill="%2367913D"/><circle cx="0" cy="0" r="14" fill="%23486E27"/></g><rect x="200" y="195" width="160" height="120" fill="none" stroke="%23EAB308" stroke-width="2" stroke-dasharray="4"/><text x="205" y="190" fill="%23EAB308" font-size="12" font-family="sans-serif" font-weight="bold">Crabgrass: 0.94</text></svg>',
    imageWidth: 640,
    imageHeight: 480,
    split: 'train',
    growthStage: 'Vegetative',
    soilType: 'Clay',
    cropContext: 'Soybean',
    annotations: [
      { id: 'ann-3', class: 'crabgrass', speciesId: 'crabgrass', bbox: [200, 195, 360, 315], growthStage: 'Vegetative' },
    ],
    dateAdded: '2026-09-14',
    verified: true,
    notes: 'Prostrate spreading tillers rooting at nodes in moist clay soil.',
  },
  {
    id: 'train-img-003',
    title: 'Common Lambsquarters with Mealy Powder Coating',
    speciesId: 'lambsquarters',
    speciesName: 'Common Lambsquarters',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="%234A3E31"/><g transform="translate(230, 210)"><path d="M0,0 L-35,-25 L-20,-50 L0,-75 L20,-50 L35,-25 Z" fill="%234B7354" stroke="%2384A38C" stroke-width="3"/><path d="M-15,-30 L-45,-45 L-25,-70 Z" fill="%235A8865"/><path d="M15,-30 L45,-45 L25,-70 Z" fill="%235A8865"/><ellipse cx="0" cy="-70" rx="12" ry="18" fill="%23A7C5AF" opacity="0.85"/><circle cx="0" cy="-40" r="14" fill="%2394B79D" opacity="0.6"/></g><g transform="translate(430, 260)"><path d="M0,0 L-25,-20 L-15,-40 L0,-60 L15,-40 L25,-20 Z" fill="%234B7354" stroke="%2384A38C" stroke-width="2"/><ellipse cx="0" cy="-55" rx="10" ry="14" fill="%23A7C5AF" opacity="0.8"/></g><rect x="180" y="130" width="115" height="110" fill="none" stroke="%2310B981" stroke-width="2" stroke-dasharray="4"/><text x="185" y="125" fill="%2310B981" font-size="12" font-family="sans-serif" font-weight="bold">Lambsquarters: 0.97</text><rect x="390" y="195" width="85" height="85" fill="none" stroke="%2310B981" stroke-width="2" stroke-dasharray="4"/><text x="395" y="190" fill="%2310B981" font-size="12" font-family="sans-serif" font-weight="bold">Lambsquarters: 0.93</text></svg>',
    imageWidth: 640,
    imageHeight: 480,
    split: 'train',
    growthStage: 'Seedling',
    soilType: 'Loam',
    cropContext: 'Fallow',
    annotations: [
      { id: 'ann-4', class: 'lambsquarters', speciesId: 'lambsquarters', bbox: [180, 130, 295, 240], growthStage: 'Seedling' },
      { id: 'ann-5', class: 'lambsquarters', speciesId: 'lambsquarters', bbox: [390, 195, 475, 280], growthStage: 'Seedling' },
    ],
    dateAdded: '2026-09-18',
    verified: true,
    notes: 'Goosefoot leaf shape with high mealy pubescence visible on apex.',
  },
  {
    id: 'train-img-004',
    title: 'Yellow Nutsedge Spike Inflorescence & Sedge Fan',
    speciesId: 'nutsedge',
    speciesName: 'Yellow Nutsedge',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="%233A3022"/><g transform="translate(310, 240)"><path d="M0,40 L-20,-70 L-35,-110 L-20,-60 L0,40" fill="%2384A936"/><path d="M0,40 L20,-70 L35,-110 L20,-60 L0,40" fill="%2384A936"/><path d="M0,40 L-5,-90 L-8,-140 L0,-80 L0,40" fill="%239ABF42"/><path d="M0,40 L8,-90 L12,-135 L0,-80 L0,40" fill="%239ABF42"/><g transform="translate(0, -125)"><line x1="0" y1="0" x2="-25" y2="-25" stroke="%23D4AF37" stroke-width="3"/><line x1="0" y1="0" x2="25" y2="-25" stroke="%23D4AF37" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="-35" stroke="%23D4AF37" stroke-width="3"/><circle cx="-25" cy="-25" r="4" fill="%23C29828"/><circle cx="25" cy="-25" r="4" fill="%23C29828"/><circle cx="0" cy="-35" r="5" fill="%23C29828"/></g></g><rect x="250" y="80" width="130" height="190" fill="none" stroke="%23F97316" stroke-width="2" stroke-dasharray="4"/><text x="255" y="75" fill="%23F97316" font-size="12" font-family="sans-serif" font-weight="bold">Nutsedge: 0.99</text></svg>',
    imageWidth: 640,
    imageHeight: 480,
    split: 'val',
    growthStage: 'Flowering',
    soilType: 'Silt',
    cropContext: 'Corn',
    annotations: [
      { id: 'ann-6', class: 'nutsedge', speciesId: 'nutsedge', bbox: [250, 80, 380, 270], growthStage: 'Flowering' },
    ],
    dateAdded: '2026-09-22',
    verified: true,
    notes: 'Glossy 3-ranked leaves with characteristic golden umbel flower spikes.',
  },
  {
    id: 'train-img-005',
    title: 'Green Foxtail Seedheads in Wheat Stubble',
    speciesId: 'foxtail',
    speciesName: 'Green Foxtail',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="%2360523C"/><line x1="50" y1="400" x2="60" y2="340" stroke="%23A89467" stroke-width="4"/><line x1="120" y1="410" x2="135" y2="330" stroke="%23A89467" stroke-width="4"/><line x1="480" y1="390" x2="470" y2="320" stroke="%23A89467" stroke-width="4"/><g transform="translate(290, 260)"><path d="M0,0 Q-20,-80 -45,-120" stroke="%23477838" stroke-width="6" fill="none"/><path d="M0,0 Q10,-70 25,-130" stroke="%23477838" stroke-width="6" fill="none"/><ellipse cx="-45" cy="-120" rx="14" ry="32" fill="%23679E4A" transform="rotate(-30, -45, -120)"/><ellipse cx="25" cy="-130" rx="12" ry="28" fill="%23679E4A" transform="rotate(15, 25, -130)"/><circle cx="-50" cy="-135" r="4" fill="%234D7D35"/><circle cx="30" cy="-145" r="4" fill="%234D7D35"/></g><rect x="210" y="100" width="160" height="180" fill="none" stroke="%2384CC16" stroke-width="2" stroke-dasharray="4"/><text x="215" y="95" fill="%2384CC16" font-size="12" font-family="sans-serif" font-weight="bold">Foxtail: 0.95</text></svg>',
    imageWidth: 640,
    imageHeight: 480,
    split: 'test',
    growthStage: 'Flowering',
    soilType: 'Sandy',
    cropContext: 'Wheat',
    annotations: [
      { id: 'ann-7', class: 'foxtail', speciesId: 'foxtail', bbox: [210, 100, 370, 280], growthStage: 'Flowering' },
    ],
    dateAdded: '2026-09-25',
    verified: true,
    notes: 'Dense bristly nodding panicles emerging through wheat post-harvest stubble.',
  },
  {
    id: 'train-img-006',
    title: 'Common Dandelion Rosette and Seed Puff',
    speciesId: 'dandelion',
    speciesName: 'Common Dandelion',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="%2342382B"/><g transform="translate(320, 280)"><ellipse cx="0" cy="0" rx="65" ry="18" fill="%233E7238"/><ellipse cx="0" cy="0" rx="18" ry="65" fill="%233E7238"/><ellipse cx="0" cy="0" rx="55" ry="55" fill="%234C8544" transform="rotate(45)"/><circle cx="0" cy="-70" r="24" fill="%23E2E8F0" opacity="0.85"/><circle cx="0" cy="-70" r="16" fill="%23CBD5E1"/><line x1="0" y1="0" x2="0" y2="-70" stroke="%237CA66D" stroke-width="5"/><circle cx="45" cy="-40" r="15" fill="%23EAB308"/><line x1="0" y1="0" x2="45" y2="-40" stroke="%237CA66D" stroke-width="4"/></g><rect x="235" y="170" width="170" height="150" fill="none" stroke="%2338BDF8" stroke-width="2" stroke-dasharray="4"/><text x="240" y="165" fill="%2338BDF8" font-size="12" font-family="sans-serif" font-weight="bold">Dandelion: 0.98</text></svg>',
    imageWidth: 640,
    imageHeight: 480,
    split: 'train',
    growthStage: 'Mature',
    soilType: 'Loam',
    cropContext: 'Fallow',
    annotations: [
      { id: 'ann-8', class: 'dandelion', speciesId: 'dandelion', bbox: [235, 170, 405, 320], growthStage: 'Mature' },
    ],
    dateAdded: '2026-09-28',
    verified: true,
    notes: 'Mature seed puff and yellow head simultaneously visible on basal rosette.',
  },
];

// Seed detection history with diverse fields and records
export const INITIAL_DETECTION_HISTORY: DetectionResult[] = [
  {
    id: 'det-hist-101',
    timestamp: '2026-10-25T14:32:00Z',
    fieldId: 'field_a',
    fieldName: 'Field Alpha (North Corn Sector)',
    imageUrl: INITIAL_TRAINING_IMAGES[0].imageUrl,
    imageWidth: 640,
    imageHeight: 480,
    totalWeeds: 4,
    weedDensityPercentage: 16.4,
    densityLevel: 'Moderate',
    averageConfidence: 0.952,
    processingTimeMs: 840,
    modelUsed: 'WeedVision-v4 / Gemini-3.8-Flash',
    detections: [
      {
        id: 'box-1',
        class: 'weed',
        speciesId: 'pigweed',
        commonName: 'Redroot Pigweed',
        scientificName: 'Amaranthus retroflexus',
        confidence: 0.978,
        bbox: [135, 155, 230, 240],
        severity: 'high',
      },
      {
        id: 'box-2',
        class: 'weed',
        speciesId: 'pigweed',
        commonName: 'Redroot Pigweed',
        scientificName: 'Amaranthus retroflexus',
        confidence: 0.961,
        bbox: [340, 175, 445, 270],
        severity: 'high',
      },
      {
        id: 'box-3',
        class: 'weed',
        speciesId: 'crabgrass',
        commonName: 'Large Crabgrass',
        scientificName: 'Digitaria sanguinalis',
        confidence: 0.932,
        bbox: [480, 280, 560, 350],
        severity: 'medium',
      },
      {
        id: 'box-4',
        class: 'weed',
        speciesId: 'foxtail',
        commonName: 'Green Foxtail',
        scientificName: 'Setaria viridis',
        confidence: 0.938,
        bbox: [80, 310, 150, 390],
        severity: 'medium',
      },
    ],
    speciesBreakdown: {
      pigweed: 2,
      crabgrass: 1,
      foxtail: 1,
    },
    recommendedRemedies: [REMEDIES_DATABASE.pigweed, REMEDIES_DATABASE.crabgrass],
    notes: 'High concentration of redroot pigweed in row 14-18. Prompt post-emergence application recommended.',
  },
  {
    id: 'det-hist-102',
    timestamp: '2026-10-24T10:15:00Z',
    fieldId: 'field_b',
    fieldName: 'Field Beta (East Soybean Ridge)',
    imageUrl: INITIAL_TRAINING_IMAGES[1].imageUrl,
    imageWidth: 640,
    imageHeight: 480,
    totalWeeds: 3,
    weedDensityPercentage: 11.8,
    densityLevel: 'Moderate',
    averageConfidence: 0.941,
    processingTimeMs: 720,
    modelUsed: 'WeedVision-v4 / Heuristic-Inference',
    detections: [
      {
        id: 'box-5',
        class: 'weed',
        speciesId: 'crabgrass',
        commonName: 'Large Crabgrass',
        scientificName: 'Digitaria sanguinalis',
        confidence: 0.954,
        bbox: [200, 195, 360, 315],
        severity: 'medium',
      },
      {
        id: 'box-6',
        class: 'weed',
        speciesId: 'lambsquarters',
        commonName: 'Common Lambsquarters',
        scientificName: 'Chenopodium album',
        confidence: 0.928,
        bbox: [420, 210, 490, 275],
        severity: 'low',
      },
      {
        id: 'box-7',
        class: 'weed',
        speciesId: 'foxtail',
        commonName: 'Green Foxtail',
        scientificName: 'Setaria viridis',
        confidence: 0.942,
        bbox: [110, 220, 175, 280],
        severity: 'low',
      },
    ],
    speciesBreakdown: {
      crabgrass: 1,
      lambsquarters: 1,
      foxtail: 1,
    },
    recommendedRemedies: [REMEDIES_DATABASE.crabgrass, REMEDIES_DATABASE.lambsquarters],
    notes: 'Scattered grass weeds along wheel compaction paths.',
  },
  {
    id: 'det-hist-103',
    timestamp: '2026-10-22T08:45:00Z',
    fieldId: 'field_c',
    fieldName: 'Field Gamma (South Wheat Basin)',
    imageUrl: INITIAL_TRAINING_IMAGES[3].imageUrl,
    imageWidth: 640,
    imageHeight: 480,
    totalWeeds: 2,
    weedDensityPercentage: 8.2,
    densityLevel: 'Low',
    averageConfidence: 0.973,
    processingTimeMs: 650,
    modelUsed: 'WeedVision-v4 / Gemini-3.8-Flash',
    detections: [
      {
        id: 'box-8',
        class: 'weed',
        speciesId: 'nutsedge',
        commonName: 'Yellow Nutsedge',
        scientificName: 'Cyperus esculentus',
        confidence: 0.985,
        bbox: [250, 80, 380, 270],
        severity: 'high',
      },
      {
        id: 'box-9',
        class: 'weed',
        speciesId: 'nutsedge',
        commonName: 'Yellow Nutsedge',
        scientificName: 'Cyperus esculentus',
        confidence: 0.961,
        bbox: [420, 220, 500, 310],
        severity: 'medium',
      },
    ],
    speciesBreakdown: {
      nutsedge: 2,
    },
    recommendedRemedies: [REMEDIES_DATABASE.nutsedge],
    notes: 'Localized sedge cluster near drainage furrow basin.',
  },
];

export const INITIAL_FIELDS: FieldInfo[] = [
  {
    id: 'field_a',
    name: 'Field Alpha (North Corn Sector)',
    crop: 'Corn (Pioneer 1197)',
    areaHectares: 14.8,
    location: '41.8781° N, 87.6298° W',
    lastScanned: '2026-10-25',
    averageDensity: 16.4,
    totalWeedsDetected: 428,
    status: 'warning',
  },
  {
    id: 'field_b',
    name: 'Field Beta (East Soybean Ridge)',
    crop: 'Soybeans (Asgrow 24XF1)',
    areaHectares: 22.4,
    location: '41.8845° N, 87.6180° W',
    lastScanned: '2026-10-24',
    averageDensity: 11.8,
    totalWeedsDetected: 264,
    status: 'good',
  },
  {
    id: 'field_c',
    name: 'Field Gamma (South Wheat Basin)',
    crop: 'Hard Red Winter Wheat',
    areaHectares: 18.0,
    location: '41.8690° N, 87.6350° W',
    lastScanned: '2026-10-22',
    averageDensity: 8.2,
    totalWeedsDetected: 147,
    status: 'good',
  },
  {
    id: 'field_d',
    name: 'Field Delta (West River Valley)',
    crop: 'Cotton / Cover Crop',
    areaHectares: 31.5,
    location: '41.8610° N, 87.6490° W',
    lastScanned: '2026-10-18',
    averageDensity: 28.5,
    totalWeedsDetected: 890,
    status: 'alert',
  },
];

// Generates simulated geospatial density grid points for a given field
export function generateFieldDensityPoints(fieldId: string): {
  field_id: string;
  area_hectares: number;
  total_weeds: number;
  average_density: number;
  max_density: number;
  min_density: number;
  points: DensityPoint[];
} {
  const field = INITIAL_FIELDS.find((f) => f.id === fieldId) || INITIAL_FIELDS[0];
  const centerLat = parseFloat(field.location.split(',')[0]);
  const centerLng = parseFloat(field.location.split(',')[1]);

  const points: DensityPoint[] = [];
  const rows = 6;
  const cols = 8;
  let totalD = 0;
  let maxD = 0;
  let minD = 100;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lat = centerLat + (r - rows / 2) * 0.0012;
      const lng = centerLng + (c - cols / 2) * 0.0016;

      // Create natural cluster hot-spots
      const distFromHotspot1 = Math.hypot(r - 2, c - 3);
      const distFromHotspot2 = Math.hypot(r - 4, c - 6);
      let density = Math.max(
        2,
        Math.round(45 * Math.exp(-distFromHotspot1 / 1.8) + 38 * Math.exp(-distFromHotspot2 / 1.6) + ((r * 7 + c * 13) % 11))
      );

      if (field.status === 'alert') density = Math.min(95, density * 1.6);
      if (field.status === 'good') density = Math.max(1, Math.round(density * 0.6));

      totalD += density;
      if (density > maxD) maxD = density;
      if (density < minD) minD = density;

      let status: DensityPoint['status'] = 'clean';
      if (density > 50) status = 'critical';
      else if (density > 30) status = 'high';
      else if (density > 15) status = 'moderate';
      else if (density > 5) status = 'low';

      const weedOptions = ['Pigweed', 'Crabgrass', 'Lambsquarters', 'Foxtail', 'Nutsedge'];
      const dominantWeed = weedOptions[(r + c) % weedOptions.length];

      points.push({
        id: `grid-${r}-${c}`,
        lat: Number(lat.toFixed(5)),
        lng: Number(lng.toFixed(5)),
        density,
        dominantWeed,
        status,
      });
    }
  }

  const avgD = Number((totalD / points.length).toFixed(1));

  return {
    field_id: field.id,
    area_hectares: field.areaHectares,
    total_weeds: field.totalWeedsDetected,
    average_density: avgD,
    max_density: maxD,
    min_density: minD,
    points,
  };
}
