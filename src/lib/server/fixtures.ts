import { categories } from '../config';

const youtubeVideos = ['cy8r7WSuT1I', 'zeJD6dqJ5lo', 'KuXjwB4LzSA', '851U557j6HE', 'cDofhN-RJqg'];

export function makeCreators(n: number) {
	const creators = [];

	for (const [c, category] of categories.entries()) {
		for (let i = 0; i < n; i++) {
			creators.push({
				email: `email${c * n + i}@gmail.com`,
				title: `title${i}`,
				category: category,
				description:
					'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem sequi ipsum ex dolores, placeat dolor blanditiis est voluptatibus similique ad nobis ab fugit explicabo tempore asperiores aliquid id itaque neque.',
				link:
					category === 'video'
						? `http://youtube.com/watch?v=${youtubeVideos[i]}`
						: `http://link${c * n + i}.com`,
				number: i
			});
		}
	}

	return creators;
}
