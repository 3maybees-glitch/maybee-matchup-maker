/* Generated from MLB Stats API (mlb.com) and Baseball-Reference defensive runs saved. Do not edit by hand. */
import type { Team } from "../lib/types";

export const STATS_NOTE =
  "Batting, pitching, win-loss records, and live scores come from MLB.com through the 2026 regular season. Defensive WAR is Baseball-Reference Defensive Runs Saved divided by 10, because MLB.com does not publish defensive WAR. Infield is first base, second base, third base, and shortstop. Outfield is left, center, and right.";

export const TEAMS: Team[] = [
  {
    "id": 139,
    "abbr": "TB",
    "name": "Rays",
    "city": "St. Petersburg",
    "full": "Tampa Bay Rays",
    "league": "AL",
    "division": "AL East",
    "w": 98,
    "l": 64,
    "pct": 0.605,
    "rd": 86,
    "rs": 736,
    "ra": 650,
    "primary": "#092C5C",
    "accent": "#8FBCE6",
    "seed": 1,
    "playoff": true,
    "winRank": 3,
    "rdRank": 6,
    "batting": {
      "avg": 0.258,
      "hr": 169,
      "sb": 164,
      "bb": 514,
      "ops": 0.728,
      "ranks": {
        "avg": 1,
        "hr": 22,
        "sb": 2,
        "bb": 22
      }
    },
    "pitching": {
      "so": 1322,
      "era": 3.7,
      "whip": 1.14,
      "sv": 58,
      "ranks": {
        "so": 19,
        "era": 7,
        "whip": 1,
        "sv": 1
      }
    },
    "defense": {
      "team": 3.4,
      "inf": 1.7,
      "of": 2.7,
      "ranks": {
        "team": 5,
        "inf": 7,
        "of": 4
      }
    },
    "starHitter": {
      "name": "Junior Caminero",
      "line": ".276, 42 HR, .884 OPS"
    },
    "starPitcher": {
      "name": "Drew Rasmussen",
      "line": "2.67 ERA, 174 K, 172.0 IP"
    }
  },
  {
    "id": 114,
    "abbr": "CLE",
    "name": "Guardians",
    "city": "Cleveland",
    "full": "Cleveland Guardians",
    "league": "AL",
    "division": "AL Central",
    "w": 85,
    "l": 77,
    "pct": 0.525,
    "rd": 11,
    "rs": 678,
    "ra": 667,
    "primary": "#00385D",
    "accent": "#E31937",
    "seed": 2,
    "playoff": true,
    "winRank": 11,
    "rdRank": 13,
    "batting": {
      "avg": 0.239,
      "hr": 162,
      "sb": 146,
      "bb": 574,
      "ops": 0.696,
      "ranks": {
        "avg": 22,
        "hr": 27,
        "sb": 7,
        "bb": 7
      }
    },
    "pitching": {
      "so": 1530,
      "era": 3.77,
      "whip": 1.26,
      "sv": 46,
      "ranks": {
        "so": 3,
        "era": 8,
        "whip": 8,
        "sv": 7
      }
    },
    "defense": {
      "team": 0.9,
      "inf": -0.9,
      "of": 1.9,
      "ranks": {
        "team": 12,
        "inf": 18,
        "of": 6
      }
    },
    "starHitter": {
      "name": "Chase DeLauter",
      "line": ".287, 16 HR, .820 OPS"
    },
    "starPitcher": {
      "name": "Parker Messick",
      "line": "2.56 ERA, 193 K, 186.1 IP"
    }
  },
  {
    "id": 117,
    "abbr": "HOU",
    "name": "Astros",
    "city": "Houston",
    "full": "Houston Astros",
    "league": "AL",
    "division": "AL West",
    "w": 81,
    "l": 81,
    "pct": 0.5,
    "rd": -32,
    "rs": 734,
    "ra": 766,
    "primary": "#002D62",
    "accent": "#EB6E1F",
    "seed": 3,
    "playoff": true,
    "winRank": 14,
    "rdRank": 19,
    "batting": {
      "avg": 0.242,
      "hr": 226,
      "sb": 50,
      "bb": 530,
      "ops": 0.732,
      "ranks": {
        "avg": 18,
        "hr": 1,
        "sb": 30,
        "bb": 16
      }
    },
    "pitching": {
      "so": 1411,
      "era": 4.45,
      "whip": 1.34,
      "sv": 49,
      "ranks": {
        "so": 9,
        "era": 24,
        "whip": 20,
        "sv": 4
      }
    },
    "defense": {
      "team": -2.4,
      "inf": -1.9,
      "of": 0.3,
      "ranks": {
        "team": 23,
        "inf": 25,
        "of": 12
      }
    },
    "starHitter": {
      "name": "Yordan Alvarez",
      "line": ".316, 42 HR, 1.033 OPS"
    },
    "starPitcher": {
      "name": "Josh Hader",
      "line": "1.01 ERA, 55 K, 44.2 IP"
    }
  },
  {
    "id": 147,
    "abbr": "NYY",
    "name": "Yankees",
    "city": "Bronx",
    "full": "New York Yankees",
    "league": "AL",
    "division": "AL East",
    "w": 93,
    "l": 68,
    "pct": 0.578,
    "rd": 138,
    "rs": 739,
    "ra": 601,
    "primary": "#003087",
    "accent": "#E4002B",
    "seed": 4,
    "playoff": true,
    "winRank": 5,
    "rdRank": 4,
    "batting": {
      "avg": 0.235,
      "hr": 223,
      "sb": 153,
      "bb": 572,
      "ops": 0.72,
      "ranks": {
        "avg": 26,
        "hr": 2,
        "sb": 6,
        "bb": 8
      }
    },
    "pitching": {
      "so": 1450,
      "era": 3.24,
      "whip": 1.17,
      "sv": 45,
      "ranks": {
        "so": 6,
        "era": 1,
        "whip": 3,
        "sv": 12
      }
    },
    "defense": {
      "team": 2.4,
      "inf": 0.2,
      "of": -0.1,
      "ranks": {
        "team": 8,
        "inf": 13,
        "of": 16
      }
    },
    "starHitter": {
      "name": "Ben Rice",
      "line": ".264, 41 HR, .897 OPS"
    },
    "starPitcher": {
      "name": "Cam Schlittler",
      "line": "1.95 ERA, 239 K, 193.2 IP"
    }
  },
  {
    "id": 111,
    "abbr": "BOS",
    "name": "Red Sox",
    "city": "Boston",
    "full": "Boston Red Sox",
    "league": "AL",
    "division": "AL East",
    "w": 87,
    "l": 75,
    "pct": 0.537,
    "rd": 78,
    "rs": 689,
    "ra": 611,
    "primary": "#BD3039",
    "accent": "#0C2340",
    "seed": 5,
    "playoff": true,
    "winRank": 9,
    "rdRank": 7,
    "batting": {
      "avg": 0.245,
      "hr": 163,
      "sb": 107,
      "bb": 517,
      "ops": 0.716,
      "ranks": {
        "avg": 13,
        "hr": 26,
        "sb": 14,
        "bb": 21
      }
    },
    "pitching": {
      "so": 1398,
      "era": 3.54,
      "whip": 1.23,
      "sv": 46,
      "ranks": {
        "so": 11,
        "era": 3,
        "whip": 6,
        "sv": 7
      }
    },
    "defense": {
      "team": 5.1,
      "inf": 0.9,
      "of": 5.9,
      "ranks": {
        "team": 4,
        "inf": 9,
        "of": 1
      }
    },
    "starHitter": {
      "name": "Willson Contreras",
      "line": ".275, 27 HR, .902 OPS"
    },
    "starPitcher": {
      "name": "Sonny Gray",
      "line": "2.72 ERA, 149 K, 169.0 IP"
    }
  },
  {
    "id": 145,
    "abbr": "CWS",
    "name": "White Sox",
    "city": "Chicago",
    "full": "Chicago White Sox",
    "league": "AL",
    "division": "AL Central",
    "w": 84,
    "l": 78,
    "pct": 0.519,
    "rd": 56,
    "rs": 776,
    "ra": 720,
    "primary": "#27251F",
    "accent": "#C4CED4",
    "seed": 6,
    "playoff": true,
    "winRank": 12,
    "rdRank": 9,
    "batting": {
      "avg": 0.236,
      "hr": 211,
      "sb": 93,
      "bb": 589,
      "ops": 0.726,
      "ranks": {
        "avg": 25,
        "hr": 5,
        "sb": 18,
        "bb": 4
      }
    },
    "pitching": {
      "so": 1337,
      "era": 4.12,
      "whip": 1.31,
      "sv": 41,
      "ranks": {
        "so": 16,
        "era": 14,
        "whip": 19,
        "sv": 18
      }
    },
    "defense": {
      "team": -2.2,
      "inf": -0.3,
      "of": -1.1,
      "ranks": {
        "team": 21,
        "inf": 15,
        "of": 22
      }
    },
    "starHitter": {
      "name": "Miguel Vargas",
      "line": ".250, 33 HR, .837 OPS"
    },
    "starPitcher": {
      "name": "Sean Burke",
      "line": "3.34 ERA, 185 K, 172.1 IP"
    }
  },
  {
    "id": 133,
    "abbr": "ATH",
    "name": "Athletics",
    "city": "Sacramento",
    "full": "Athletics",
    "league": "AL",
    "division": "AL West",
    "w": 64,
    "l": 98,
    "pct": 0.395,
    "rd": -238,
    "rs": 699,
    "ra": 937,
    "primary": "#003831",
    "accent": "#EFB21E",
    "seed": null,
    "playoff": false,
    "winRank": 28,
    "rdRank": 30,
    "batting": {
      "avg": 0.245,
      "hr": 194,
      "sb": 91,
      "bb": 520,
      "ops": 0.719,
      "ranks": {
        "avg": 13,
        "hr": 11,
        "sb": 20,
        "bb": 20
      }
    },
    "pitching": {
      "so": 1356,
      "era": 5.51,
      "whip": 1.51,
      "sv": 39,
      "ranks": {
        "so": 14,
        "era": 29,
        "whip": 29,
        "sv": 20
      }
    },
    "defense": {
      "team": -4.6,
      "inf": -1.8,
      "of": -1.4,
      "ranks": {
        "team": 26,
        "inf": 24,
        "of": 24
      }
    },
    "starHitter": {
      "name": "Lawrence Butler",
      "line": ".237, 17 HR, .720 OPS"
    },
    "starPitcher": null
  },
  {
    "id": 110,
    "abbr": "BAL",
    "name": "Orioles",
    "city": "Baltimore",
    "full": "Baltimore Orioles",
    "league": "AL",
    "division": "AL East",
    "w": 79,
    "l": 82,
    "pct": 0.491,
    "rd": -21,
    "rs": 718,
    "ra": 739,
    "primary": "#DF4601",
    "accent": "#000000",
    "seed": null,
    "playoff": false,
    "winRank": 17,
    "rdRank": 17,
    "batting": {
      "avg": 0.234,
      "hr": 199,
      "sb": 78,
      "bb": 586,
      "ops": 0.71,
      "ranks": {
        "avg": 27,
        "hr": 10,
        "sb": 25,
        "bb": 5
      }
    },
    "pitching": {
      "so": 1305,
      "era": 4.08,
      "whip": 1.34,
      "sv": 46,
      "ranks": {
        "so": 22,
        "era": 12,
        "whip": 20,
        "sv": 7
      }
    },
    "defense": {
      "team": 0.6,
      "inf": -1.3,
      "of": 0.7,
      "ranks": {
        "team": 14,
        "inf": 22,
        "of": 9
      }
    },
    "starHitter": {
      "name": "Pete Alonso",
      "line": ".267, 43 HR, .885 OPS"
    },
    "starPitcher": {
      "name": "Trevor Rogers",
      "line": "4.03 ERA, 157 K, 169.2 IP"
    }
  },
  {
    "id": 116,
    "abbr": "DET",
    "name": "Tigers",
    "city": "Detroit",
    "full": "Detroit Tigers",
    "league": "AL",
    "division": "AL Central",
    "w": 76,
    "l": 86,
    "pct": 0.469,
    "rd": 71,
    "rs": 723,
    "ra": 652,
    "primary": "#0C2340",
    "accent": "#FA4616",
    "seed": null,
    "playoff": false,
    "winRank": 22,
    "rdRank": 8,
    "batting": {
      "avg": 0.241,
      "hr": 181,
      "sb": 58,
      "bb": 585,
      "ops": 0.72,
      "ranks": {
        "avg": 20,
        "hr": 18,
        "sb": 29,
        "bb": 6
      }
    },
    "pitching": {
      "so": 1312,
      "era": 3.67,
      "whip": 1.22,
      "sv": 32,
      "ranks": {
        "so": 21,
        "era": 6,
        "whip": 5,
        "sv": 27
      }
    },
    "defense": {
      "team": -0.1,
      "inf": -0.9,
      "of": -0.8,
      "ranks": {
        "team": 18,
        "inf": 18,
        "of": 20
      }
    },
    "starHitter": {
      "name": "Riley Greene",
      "line": ".280, 21 HR, .844 OPS"
    },
    "starPitcher": {
      "name": "Framber Valdez",
      "line": "4.03 ERA, 135 K, 174.0 IP"
    }
  },
  {
    "id": 118,
    "abbr": "KC",
    "name": "Royals",
    "city": "Kansas City",
    "full": "Kansas City Royals",
    "league": "AL",
    "division": "AL Central",
    "w": 69,
    "l": 93,
    "pct": 0.426,
    "rd": -120,
    "rs": 690,
    "ra": 810,
    "primary": "#004687",
    "accent": "#BD9B60",
    "seed": null,
    "playoff": false,
    "winRank": 26,
    "rdRank": 27,
    "batting": {
      "avg": 0.247,
      "hr": 170,
      "sb": 130,
      "bb": 512,
      "ops": 0.718,
      "ranks": {
        "avg": 8,
        "hr": 21,
        "sb": 9,
        "bb": 23
      }
    },
    "pitching": {
      "so": 1173,
      "era": 4.77,
      "whip": 1.41,
      "sv": 38,
      "ranks": {
        "so": 28,
        "era": 27,
        "whip": 27,
        "sv": 21
      }
    },
    "defense": {
      "team": 1.5,
      "inf": 3.3,
      "of": -1.6,
      "ranks": {
        "team": 10,
        "inf": 1,
        "of": 25
      }
    },
    "starHitter": {
      "name": "Jac Caglianone",
      "line": ".289, 23 HR, .834 OPS"
    },
    "starPitcher": {
      "name": "Michael Wacha",
      "line": "3.32 ERA, 158 K, 200.2 IP"
    }
  },
  {
    "id": 108,
    "abbr": "LAA",
    "name": "Angels",
    "city": "Anaheim",
    "full": "Los Angeles Angels",
    "league": "AL",
    "division": "AL West",
    "w": 62,
    "l": 100,
    "pct": 0.383,
    "rd": -97,
    "rs": 655,
    "ra": 752,
    "primary": "#BA0021",
    "accent": "#003263",
    "seed": null,
    "playoff": false,
    "winRank": 29,
    "rdRank": 26,
    "batting": {
      "avg": 0.234,
      "hr": 154,
      "sb": 93,
      "bb": 511,
      "ops": 0.679,
      "ranks": {
        "avg": 27,
        "hr": 28,
        "sb": 18,
        "bb": 24
      }
    },
    "pitching": {
      "so": 1439,
      "era": 4.29,
      "whip": 1.35,
      "sv": 25,
      "ranks": {
        "so": 8,
        "era": 21,
        "whip": 22,
        "sv": 30
      }
    },
    "defense": {
      "team": -4.4,
      "inf": -1.2,
      "of": -1.7,
      "ranks": {
        "team": 25,
        "inf": 20,
        "of": 26
      }
    },
    "starHitter": {
      "name": "Mike Trout",
      "line": ".242, 22 HR, .803 OPS"
    },
    "starPitcher": {
      "name": "Reid Detmers",
      "line": "3.36 ERA, 211 K, 185.0 IP"
    }
  },
  {
    "id": 142,
    "abbr": "MIN",
    "name": "Twins",
    "city": "Minneapolis",
    "full": "Minnesota Twins",
    "league": "AL",
    "division": "AL Central",
    "w": 77,
    "l": 85,
    "pct": 0.475,
    "rd": -58,
    "rs": 739,
    "ra": 797,
    "primary": "#002B5C",
    "accent": "#D31145",
    "seed": null,
    "playoff": false,
    "winRank": 19,
    "rdRank": 23,
    "batting": {
      "avg": 0.245,
      "hr": 187,
      "sb": 91,
      "bb": 507,
      "ops": 0.72,
      "ranks": {
        "avg": 13,
        "hr": 12,
        "sb": 20,
        "bb": 26
      }
    },
    "pitching": {
      "so": 1381,
      "era": 4.56,
      "whip": 1.36,
      "sv": 45,
      "ranks": {
        "so": 13,
        "era": 25,
        "whip": 23,
        "sv": 12
      }
    },
    "defense": {
      "team": -4.2,
      "inf": -2.6,
      "of": -0.7,
      "ranks": {
        "team": 24,
        "inf": 28,
        "of": 19
      }
    },
    "starHitter": {
      "name": "Luke Keaschall",
      "line": ".282, 10 HR, .781 OPS"
    },
    "starPitcher": {
      "name": "Taj Bradley",
      "line": "3.73 ERA, 205 K, 178.1 IP"
    }
  },
  {
    "id": 136,
    "abbr": "SEA",
    "name": "Mariners",
    "city": "Seattle",
    "full": "Seattle Mariners",
    "league": "AL",
    "division": "AL West",
    "w": 76,
    "l": 86,
    "pct": 0.469,
    "rd": -58,
    "rs": 664,
    "ra": 722,
    "primary": "#0C2C56",
    "accent": "#005C5C",
    "seed": null,
    "playoff": false,
    "winRank": 22,
    "rdRank": 23,
    "batting": {
      "avg": 0.233,
      "hr": 182,
      "sb": 114,
      "bb": 557,
      "ops": 0.693,
      "ranks": {
        "avg": 29,
        "hr": 16,
        "sb": 10,
        "bb": 10
      }
    },
    "pitching": {
      "so": 1392,
      "era": 4.2,
      "whip": 1.27,
      "sv": 35,
      "ranks": {
        "so": 12,
        "era": 19,
        "whip": 10,
        "sv": 24
      }
    },
    "defense": {
      "team": -6.1,
      "inf": -2.5,
      "of": -1.8,
      "ranks": {
        "team": 30,
        "inf": 27,
        "of": 28
      }
    },
    "starHitter": {
      "name": "Randy Arozarena",
      "line": ".281, 26 HR, .865 OPS"
    },
    "starPitcher": {
      "name": "Logan Gilbert",
      "line": "3.73 ERA, 205 K, 186.0 IP"
    }
  },
  {
    "id": 140,
    "abbr": "TEX",
    "name": "Rangers",
    "city": "Arlington",
    "full": "Texas Rangers",
    "league": "AL",
    "division": "AL West",
    "w": 80,
    "l": 82,
    "pct": 0.494,
    "rd": -46,
    "rs": 673,
    "ra": 719,
    "primary": "#003278",
    "accent": "#C0111F",
    "seed": null,
    "playoff": false,
    "winRank": 15,
    "rdRank": 21,
    "batting": {
      "avg": 0.242,
      "hr": 183,
      "sb": 78,
      "bb": 525,
      "ops": 0.713,
      "ranks": {
        "avg": 18,
        "hr": 14,
        "sb": 25,
        "bb": 19
      }
    },
    "pitching": {
      "so": 1337,
      "era": 4.32,
      "whip": 1.3,
      "sv": 43,
      "ranks": {
        "so": 16,
        "era": 22,
        "whip": 17,
        "sv": 14
      }
    },
    "defense": {
      "team": -2.2,
      "inf": -2.3,
      "of": 0.3,
      "ranks": {
        "team": 21,
        "inf": 26,
        "of": 12
      }
    },
    "starHitter": {
      "name": "Ezequiel Duran",
      "line": ".260, 17 HR, .739 OPS"
    },
    "starPitcher": {
      "name": "Jacob deGrom",
      "line": "4.20 ERA, 201 K, 162.2 IP"
    }
  },
  {
    "id": 141,
    "abbr": "TOR",
    "name": "Blue Jays",
    "city": "Toronto",
    "full": "Toronto Blue Jays",
    "league": "AL",
    "division": "AL East",
    "w": 79,
    "l": 83,
    "pct": 0.488,
    "rd": -46,
    "rs": 648,
    "ra": 694,
    "primary": "#134A8E",
    "accent": "#1D2D5C",
    "seed": null,
    "playoff": false,
    "winRank": 18,
    "rdRank": 21,
    "batting": {
      "avg": 0.247,
      "hr": 152,
      "sb": 75,
      "bb": 459,
      "ops": 0.691,
      "ranks": {
        "avg": 8,
        "hr": 30,
        "sb": 27,
        "bb": 29
      }
    },
    "pitching": {
      "so": 1410,
      "era": 3.89,
      "whip": 1.29,
      "sv": 52,
      "ranks": {
        "so": 10,
        "era": 9,
        "whip": 13,
        "sv": 3
      }
    },
    "defense": {
      "team": 3.4,
      "inf": 1.6,
      "of": 0.3,
      "ranks": {
        "team": 5,
        "inf": 8,
        "of": 12
      }
    },
    "starHitter": {
      "name": "Kazuma Okamoto",
      "line": ".232, 33 HR, .762 OPS"
    },
    "starPitcher": {
      "name": "Dylan Cease",
      "line": "2.40 ERA, 239 K, 169.0 IP"
    }
  },
  {
    "id": 158,
    "abbr": "MIL",
    "name": "Brewers",
    "city": "Milwaukee",
    "full": "Milwaukee Brewers",
    "league": "NL",
    "division": "NL Central",
    "w": 103,
    "l": 59,
    "pct": 0.636,
    "rd": 214,
    "rs": 832,
    "ra": 618,
    "primary": "#12284B",
    "accent": "#FFC52F",
    "seed": 1,
    "playoff": true,
    "winRank": 1,
    "rdRank": 1,
    "batting": {
      "avg": 0.258,
      "hr": 154,
      "sb": 162,
      "bb": 668,
      "ops": 0.744,
      "ranks": {
        "avg": 1,
        "hr": 28,
        "sb": 5,
        "bb": 2
      }
    },
    "pitching": {
      "so": 1544,
      "era": 3.51,
      "whip": 1.18,
      "sv": 55,
      "ranks": {
        "so": 2,
        "era": 2,
        "whip": 4,
        "sv": 2
      }
    },
    "defense": {
      "team": 5.2,
      "inf": 3.2,
      "of": 3.1,
      "ranks": {
        "team": 3,
        "inf": 2,
        "of": 3
      }
    },
    "starHitter": {
      "name": "Jake Bauers",
      "line": ".266, 26 HR, .873 OPS"
    },
    "starPitcher": {
      "name": "Jacob Misiorowski",
      "line": "1.80 ERA, 252 K, 174.2 IP"
    }
  },
  {
    "id": 119,
    "abbr": "LAD",
    "name": "Dodgers",
    "city": "Los Angeles",
    "full": "Los Angeles Dodgers",
    "league": "NL",
    "division": "NL West",
    "w": 100,
    "l": 62,
    "pct": 0.617,
    "rd": 201,
    "rs": 801,
    "ra": 600,
    "primary": "#005A9C",
    "accent": "#EF3E42",
    "seed": 2,
    "playoff": true,
    "winRank": 2,
    "rdRank": 2,
    "batting": {
      "avg": 0.257,
      "hr": 204,
      "sb": 72,
      "bb": 628,
      "ops": 0.762,
      "ranks": {
        "avg": 3,
        "hr": 7,
        "sb": 28,
        "bb": 3
      }
    },
    "pitching": {
      "so": 1521,
      "era": 3.55,
      "whip": 1.14,
      "sv": 46,
      "ranks": {
        "so": 4,
        "era": 4,
        "whip": 1,
        "sv": 7
      }
    },
    "defense": {
      "team": 1.4,
      "inf": 1.9,
      "of": 0.7,
      "ranks": {
        "team": 11,
        "inf": 5,
        "of": 9
      }
    },
    "starHitter": {
      "name": "Shohei Ohtani",
      "line": ".275, 30 HR, .889 OPS"
    },
    "starPitcher": {
      "name": "Yoshinobu Yamamoto",
      "line": "2.53 ERA, 182 K, 185.0 IP"
    }
  },
  {
    "id": 144,
    "abbr": "ATL",
    "name": "Braves",
    "city": "Atlanta",
    "full": "Atlanta Braves",
    "league": "NL",
    "division": "NL East",
    "w": 94,
    "l": 68,
    "pct": 0.58,
    "rd": 116,
    "rs": 742,
    "ra": 626,
    "primary": "#CE1141",
    "accent": "#13274F",
    "seed": 3,
    "playoff": true,
    "winRank": 4,
    "rdRank": 5,
    "batting": {
      "avg": 0.246,
      "hr": 204,
      "sb": 83,
      "bb": 465,
      "ops": 0.718,
      "ranks": {
        "avg": 10,
        "hr": 7,
        "sb": 23,
        "bb": 28
      }
    },
    "pitching": {
      "so": 1350,
      "era": 3.63,
      "whip": 1.24,
      "sv": 49,
      "ranks": {
        "so": 15,
        "era": 5,
        "whip": 7,
        "sv": 4
      }
    },
    "defense": {
      "team": 5.6,
      "inf": 2.7,
      "of": 2.6,
      "ranks": {
        "team": 2,
        "inf": 3,
        "of": 5
      }
    },
    "starHitter": {
      "name": "Matt Olson",
      "line": ".251, 41 HR, .823 OPS"
    },
    "starPitcher": {
      "name": "Chris Sale",
      "line": "2.16 ERA, 200 K, 162.2 IP"
    }
  },
  {
    "id": 135,
    "abbr": "SD",
    "name": "Padres",
    "city": "San Diego",
    "full": "San Diego Padres",
    "league": "NL",
    "division": "NL West",
    "w": 91,
    "l": 71,
    "pct": 0.562,
    "rd": 41,
    "rs": 722,
    "ra": 681,
    "primary": "#2F241D",
    "accent": "#FFC425",
    "seed": 4,
    "playoff": true,
    "winRank": 6,
    "rdRank": 10,
    "batting": {
      "avg": 0.244,
      "hr": 183,
      "sb": 164,
      "bb": 554,
      "ops": 0.717,
      "ranks": {
        "avg": 17,
        "hr": 14,
        "sb": 2,
        "bb": 13
      }
    },
    "pitching": {
      "so": 1315,
      "era": 3.99,
      "whip": 1.29,
      "sv": 48,
      "ranks": {
        "so": 20,
        "era": 10,
        "whip": 13,
        "sv": 6
      }
    },
    "defense": {
      "team": 0.4,
      "inf": -0.2,
      "of": -0.4,
      "ranks": {
        "team": 15,
        "inf": 14,
        "of": 18
      }
    },
    "starHitter": {
      "name": "Fernando Tatis Jr.",
      "line": ".289, 25 HR, .828 OPS"
    },
    "starPitcher": {
      "name": "Michael King",
      "line": "3.21 ERA, 159 K, 185.0 IP"
    }
  },
  {
    "id": 112,
    "abbr": "CHC",
    "name": "Cubs",
    "city": "Chicago",
    "full": "Chicago Cubs",
    "league": "NL",
    "division": "NL Central",
    "w": 89,
    "l": 73,
    "pct": 0.549,
    "rd": 147,
    "rs": 850,
    "ra": 703,
    "primary": "#0E3386",
    "accent": "#CC3433",
    "seed": 5,
    "playoff": true,
    "winRank": 7,
    "rdRank": 3,
    "batting": {
      "avg": 0.251,
      "hr": 220,
      "sb": 114,
      "bb": 674,
      "ops": 0.767,
      "ranks": {
        "avg": 6,
        "hr": 3,
        "sb": 10,
        "bb": 1
      }
    },
    "pitching": {
      "so": 1260,
      "era": 4.12,
      "whip": 1.26,
      "sv": 36,
      "ranks": {
        "so": 26,
        "era": 14,
        "whip": 8,
        "sv": 23
      }
    },
    "defense": {
      "team": 8.5,
      "inf": 2.5,
      "of": 4.5,
      "ranks": {
        "team": 1,
        "inf": 4,
        "of": 2
      }
    },
    "starHitter": {
      "name": "Pete Crow-Armstrong",
      "line": ".280, 45 HR, .942 OPS"
    },
    "starPitcher": {
      "name": "Shota Imanaga",
      "line": "3.77 ERA, 174 K, 174.1 IP"
    }
  },
  {
    "id": 143,
    "abbr": "PHI",
    "name": "Phillies",
    "city": "Philadelphia",
    "full": "Philadelphia Phillies",
    "league": "NL",
    "division": "NL East",
    "w": 88,
    "l": 74,
    "pct": 0.543,
    "rd": 15,
    "rs": 713,
    "ra": 698,
    "primary": "#E81828",
    "accent": "#002D72",
    "seed": 6,
    "playoff": true,
    "winRank": 8,
    "rdRank": 12,
    "batting": {
      "avg": 0.24,
      "hr": 182,
      "sb": 105,
      "bb": 529,
      "ops": 0.707,
      "ranks": {
        "avg": 21,
        "hr": 16,
        "sb": 15,
        "bb": 17
      }
    },
    "pitching": {
      "so": 1577,
      "era": 4.04,
      "whip": 1.29,
      "sv": 42,
      "ranks": {
        "so": 1,
        "era": 11,
        "whip": 13,
        "sv": 15
      }
    },
    "defense": {
      "team": -4.7,
      "inf": -4.1,
      "of": -0.3,
      "ranks": {
        "team": 27,
        "inf": 30,
        "of": 17
      }
    },
    "starHitter": {
      "name": "Bryce Harper",
      "line": ".269, 29 HR, .865 OPS"
    },
    "starPitcher": {
      "name": "Jesús Luzardo",
      "line": "2.86 ERA, 221 K, 179.2 IP"
    }
  },
  {
    "id": 109,
    "abbr": "AZ",
    "name": "D-backs",
    "city": "Phoenix",
    "full": "Arizona Diamondbacks",
    "league": "NL",
    "division": "NL West",
    "w": 86,
    "l": 76,
    "pct": 0.531,
    "rd": 9,
    "rs": 739,
    "ra": 730,
    "primary": "#A71930",
    "accent": "#E3D4AD",
    "seed": null,
    "playoff": false,
    "winRank": 10,
    "rdRank": 14,
    "batting": {
      "avg": 0.246,
      "hr": 166,
      "sb": 103,
      "bb": 541,
      "ops": 0.72,
      "ranks": {
        "avg": 10,
        "hr": 25,
        "sb": 16,
        "bb": 15
      }
    },
    "pitching": {
      "so": 1140,
      "era": 4.18,
      "whip": 1.28,
      "sv": 38,
      "ranks": {
        "so": 29,
        "era": 18,
        "whip": 11,
        "sv": 21
      }
    },
    "defense": {
      "team": 2.4,
      "inf": 0.9,
      "of": 1.9,
      "ranks": {
        "team": 8,
        "inf": 9,
        "of": 6
      }
    },
    "starHitter": {
      "name": "Gabriel Moreno",
      "line": ".311, 16 HR, .874 OPS"
    },
    "starPitcher": {
      "name": "Eduardo Rodriguez",
      "line": "2.89 ERA, 143 K, 189.2 IP"
    }
  },
  {
    "id": 113,
    "abbr": "CIN",
    "name": "Reds",
    "city": "Cincinnati",
    "full": "Cincinnati Reds",
    "league": "NL",
    "division": "NL Central",
    "w": 75,
    "l": 87,
    "pct": 0.463,
    "rd": -160,
    "rs": 666,
    "ra": 826,
    "primary": "#C6011F",
    "accent": "#000000",
    "seed": null,
    "playoff": false,
    "winRank": 24,
    "rdRank": 28,
    "batting": {
      "avg": 0.229,
      "hr": 213,
      "sb": 112,
      "bb": 557,
      "ops": 0.699,
      "ranks": {
        "avg": 30,
        "hr": 4,
        "sb": 12,
        "bb": 10
      }
    },
    "pitching": {
      "so": 1293,
      "era": 4.83,
      "whip": 1.44,
      "sv": 42,
      "ranks": {
        "so": 23,
        "era": 28,
        "whip": 28,
        "sv": 15
      }
    },
    "defense": {
      "team": -5.4,
      "inf": -3.4,
      "of": -0.9,
      "ranks": {
        "team": 29,
        "inf": 29,
        "of": 21
      }
    },
    "starHitter": {
      "name": "Elly De La Cruz",
      "line": ".283, 30 HR, .880 OPS"
    },
    "starPitcher": {
      "name": "Andrew Abbott",
      "line": "4.61 ERA, 131 K, 166.0 IP"
    }
  },
  {
    "id": 115,
    "abbr": "COL",
    "name": "Rockies",
    "city": "Denver",
    "full": "Colorado Rockies",
    "league": "NL",
    "division": "NL West",
    "w": 58,
    "l": 104,
    "pct": 0.358,
    "rd": -192,
    "rs": 752,
    "ra": 944,
    "primary": "#33006F",
    "accent": "#C4CED4",
    "seed": null,
    "playoff": false,
    "winRank": 30,
    "rdRank": 29,
    "batting": {
      "avg": 0.254,
      "hr": 180,
      "sb": 109,
      "bb": 500,
      "ops": 0.739,
      "ranks": {
        "avg": 4,
        "hr": 19,
        "sb": 13,
        "bb": 27
      }
    },
    "pitching": {
      "so": 1113,
      "era": 5.59,
      "whip": 1.52,
      "sv": 33,
      "ranks": {
        "so": 30,
        "era": 30,
        "whip": 30,
        "sv": 26
      }
    },
    "defense": {
      "team": -4.8,
      "inf": -1.2,
      "of": -3.7,
      "ranks": {
        "team": 28,
        "inf": 20,
        "of": 30
      }
    },
    "starHitter": {
      "name": "TJ Rumfield",
      "line": ".300, 16 HR, .843 OPS"
    },
    "starPitcher": null
  },
  {
    "id": 146,
    "abbr": "MIA",
    "name": "Marlins",
    "city": "Miami",
    "full": "Miami Marlins",
    "league": "NL",
    "division": "NL East",
    "w": 80,
    "l": 82,
    "pct": 0.494,
    "rd": 3,
    "rs": 715,
    "ra": 712,
    "primary": "#00A3E0",
    "accent": "#EF3340",
    "seed": null,
    "playoff": false,
    "winRank": 15,
    "rdRank": 16,
    "batting": {
      "avg": 0.249,
      "hr": 168,
      "sb": 163,
      "bb": 552,
      "ops": 0.726,
      "ranks": {
        "avg": 7,
        "hr": 23,
        "sb": 4,
        "bb": 14
      }
    },
    "pitching": {
      "so": 1323,
      "era": 4.09,
      "whip": 1.28,
      "sv": 35,
      "ranks": {
        "so": 18,
        "era": 13,
        "whip": 11,
        "sv": 24
      }
    },
    "defense": {
      "team": -2,
      "inf": -0.4,
      "of": -2,
      "ranks": {
        "team": 20,
        "inf": 16,
        "of": 29
      }
    },
    "starHitter": {
      "name": "Kyle Stowers",
      "line": ".239, 21 HR, .790 OPS"
    },
    "starPitcher": {
      "name": "Sandy Alcantara",
      "line": "3.87 ERA, 153 K, 214.0 IP"
    }
  },
  {
    "id": 121,
    "abbr": "NYM",
    "name": "Mets",
    "city": "Flushing",
    "full": "New York Mets",
    "league": "NL",
    "division": "NL East",
    "w": 74,
    "l": 88,
    "pct": 0.457,
    "rd": -32,
    "rs": 699,
    "ra": 731,
    "primary": "#002D72",
    "accent": "#FF5910",
    "seed": null,
    "playoff": false,
    "winRank": 25,
    "rdRank": 19,
    "batting": {
      "avg": 0.239,
      "hr": 204,
      "sb": 83,
      "bb": 528,
      "ops": 0.705,
      "ranks": {
        "avg": 22,
        "hr": 7,
        "sb": 23,
        "bb": 18
      }
    },
    "pitching": {
      "so": 1450,
      "era": 4.15,
      "whip": 1.29,
      "sv": 31,
      "ranks": {
        "so": 6,
        "era": 16,
        "whip": 13,
        "sv": 28
      }
    },
    "defense": {
      "team": 2.5,
      "inf": -1.6,
      "of": 1.4,
      "ranks": {
        "team": 7,
        "inf": 23,
        "of": 8
      }
    },
    "starHitter": {
      "name": "Carson Benge",
      "line": ".282, 20 HR, .776 OPS"
    },
    "starPitcher": {
      "name": "Nolan McLean",
      "line": "3.16 ERA, 194 K, 179.2 IP"
    }
  },
  {
    "id": 134,
    "abbr": "PIT",
    "name": "Pirates",
    "city": "Pittsburgh",
    "full": "Pittsburgh Pirates",
    "league": "NL",
    "division": "NL Central",
    "w": 82,
    "l": 80,
    "pct": 0.506,
    "rd": 28,
    "rs": 767,
    "ra": 739,
    "primary": "#27251F",
    "accent": "#FDB827",
    "seed": null,
    "playoff": false,
    "winRank": 13,
    "rdRank": 11,
    "batting": {
      "avg": 0.253,
      "hr": 186,
      "sb": 132,
      "bb": 568,
      "ops": 0.734,
      "ranks": {
        "avg": 5,
        "hr": 13,
        "sb": 8,
        "bb": 9
      }
    },
    "pitching": {
      "so": 1496,
      "era": 4.15,
      "whip": 1.3,
      "sv": 41,
      "ranks": {
        "so": 5,
        "era": 16,
        "whip": 17,
        "sv": 18
      }
    },
    "defense": {
      "team": -1.7,
      "inf": -0.4,
      "of": -1.1,
      "ranks": {
        "team": 19,
        "inf": 16,
        "of": 22
      }
    },
    "starHitter": {
      "name": "Brandon Lowe",
      "line": ".260, 35 HR, .824 OPS"
    },
    "starPitcher": {
      "name": "Braxton Ashcraft",
      "line": "3.65 ERA, 173 K, 165.1 IP"
    }
  },
  {
    "id": 137,
    "abbr": "SF",
    "name": "Giants",
    "city": "San Francisco",
    "full": "San Francisco Giants",
    "league": "NL",
    "division": "NL West",
    "w": 65,
    "l": 97,
    "pct": 0.401,
    "rd": -91,
    "rs": 669,
    "ra": 760,
    "primary": "#FD5A1E",
    "accent": "#27251F",
    "seed": null,
    "playoff": false,
    "winRank": 27,
    "rdRank": 25,
    "batting": {
      "avg": 0.245,
      "hr": 178,
      "sb": 88,
      "bb": 449,
      "ops": 0.706,
      "ranks": {
        "avg": 13,
        "hr": 20,
        "sb": 22,
        "bb": 30
      }
    },
    "pitching": {
      "so": 1204,
      "era": 4.33,
      "whip": 1.36,
      "sv": 30,
      "ranks": {
        "so": 27,
        "era": 23,
        "whip": 23,
        "sv": 29
      }
    },
    "defense": {
      "team": 0.3,
      "inf": 0.4,
      "of": 0.5,
      "ranks": {
        "team": 16,
        "inf": 11,
        "of": 11
      }
    },
    "starHitter": {
      "name": "Rafael Devers",
      "line": ".258, 37 HR, .865 OPS"
    },
    "starPitcher": null
  },
  {
    "id": 138,
    "abbr": "STL",
    "name": "Cardinals",
    "city": "St. Louis",
    "full": "St. Louis Cardinals",
    "league": "NL",
    "division": "NL Central",
    "w": 77,
    "l": 85,
    "pct": 0.475,
    "rd": -29,
    "rs": 720,
    "ra": 749,
    "primary": "#C41E3A",
    "accent": "#0C2340",
    "seed": null,
    "playoff": false,
    "winRank": 19,
    "rdRank": 18,
    "batting": {
      "avg": 0.239,
      "hr": 167,
      "sb": 100,
      "bb": 511,
      "ops": 0.691,
      "ranks": {
        "avg": 22,
        "hr": 24,
        "sb": 17,
        "bb": 24
      }
    },
    "pitching": {
      "so": 1278,
      "era": 4.26,
      "whip": 1.36,
      "sv": 46,
      "ranks": {
        "so": 25,
        "era": 20,
        "whip": 23,
        "sv": 7
      }
    },
    "defense": {
      "team": 0.2,
      "inf": 1.8,
      "of": -1.7,
      "ranks": {
        "team": 17,
        "inf": 6,
        "of": 26
      }
    },
    "starHitter": {
      "name": "Alec Burleson",
      "line": ".279, 26 HR, .816 OPS"
    },
    "starPitcher": {
      "name": "Andre Pallante",
      "line": "3.83 ERA, 110 K, 162.0 IP"
    }
  },
  {
    "id": 120,
    "abbr": "WSH",
    "name": "Nationals",
    "city": "Washington",
    "full": "Washington Nationals",
    "league": "NL",
    "division": "NL East",
    "w": 77,
    "l": 85,
    "pct": 0.475,
    "rd": 6,
    "rs": 821,
    "ra": 815,
    "primary": "#AB0003",
    "accent": "#14225A",
    "seed": null,
    "playoff": false,
    "winRank": 19,
    "rdRank": 15,
    "batting": {
      "avg": 0.246,
      "hr": 210,
      "sb": 178,
      "bb": 555,
      "ops": 0.744,
      "ranks": {
        "avg": 10,
        "hr": 6,
        "sb": 1,
        "bb": 12
      }
    },
    "pitching": {
      "so": 1283,
      "era": 4.67,
      "whip": 1.39,
      "sv": 42,
      "ranks": {
        "so": 24,
        "era": 26,
        "whip": 26,
        "sv": 15
      }
    },
    "defense": {
      "team": 0.7,
      "inf": 0.3,
      "of": 0.1,
      "ranks": {
        "team": 13,
        "inf": 12,
        "of": 15
      }
    },
    "starHitter": {
      "name": "James Wood",
      "line": ".265, 30 HR, .891 OPS"
    },
    "starPitcher": {
      "name": "Cade Cavalli",
      "line": "3.02 ERA, 200 K, 169.2 IP"
    }
  }
];
