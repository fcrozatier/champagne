import time

import requests

data = [
    ("Pixel Art Anti Aliasing", "d6tp43wZqps"),
    ("Escaping a Nuclear Explosion: how the Enola Gay survived", "IEsIXui-YS8"),
    ("Making a Pitch Shifter", "PjKlMXhxtTM"),
    ("The Longest Increasing Subsequence", "6WjnRyYLmM4"),
    ("Watching Neural Networks Learn", "TkwXa7Cvfr8"),
    ("The Art of Linear Programming", "E72DWgKP_1Y"),
    ("The Mosaic Problem - How and Why to do Math for Fun", "D3dp5RBmPcs"),
    ("Affording a Planet With Geometry", "jSYX6pN_sAs"),
    ("When CAN'T Math Be Generalized?", "krtf-v19TJg"),
    ("Rotation + Translation = Rotation. Animated proof", "1EpQtVJb0OU"),
    ("Rethinking the real line", "uFWJuZQLKJs"),
    ("How did the Ancient Egyptians find this volume without Algebra?", "xmoIrwTsZbg"),
    ("A Subtle Aspect of Circular Motion", "AL2Chc6p_Kk"),
    ("Minimal Surfaces & the Calculus of Variations", "8SABptOYUVk"),
    ("What Happens If We Add Fractions Incorrectly?", "4d6YrTKmjfE"),
    ("Can you guess this shape from its shadows?", "Cnhr6VaQKlg"),
    ("Chasing Fixed Points: Greedy Gremlin's Trade-Off", "q8gng_2gn70"),
    ("Mathematical Magic Mirrorball", "rJPKTCdk-WI"),
    ("The Mathematics of String Art", "WGccIFf6MF8"),
    ("How Infinity Works", "FzuMSJTysmg"),
]

for title, id in data:
    res = requests.get(f"https://img.youtube.com/vi/{id}/maxresdefault.jpg")

    with open(f"{title}.jpg", "wb") as f:
        f.write(res.content)

    print(f"Created file {title}.jpg")
    time.sleep(0.5)
