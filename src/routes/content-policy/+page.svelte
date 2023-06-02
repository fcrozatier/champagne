<script>
	import { COMPETITION_FULL_NAME, COMPETITION_SHORT_NAME } from '$lib/config';
</script>

<svelte:head>
	<title>Content Policy &middot; {COMPETITION_SHORT_NAME}</title>
</svelte:head>

<article class="layout-prose">
	<h2>Content Policy</h2>
	<p>
		Please note that this page does not contain legal advice. Rather, it is a set of guidelines to
		follow to make sure that your submission to the {COMPETITION_FULL_NAME} abides by proper copyright
		law and is eligible for winning the cash prize at the end.
	</p>
	<p>
		In general, as long as you double-check to make sure you have permission to use all material
		(music, video, imagery, text, etc.) contained in your submission to the Summer of Math
		Exposition, you should be good to go. That said, copyright law is incredibly confusing, so this
		page should (hopefully) help you navigate a bit.
	</p>
	<h3 id="fair-use">On Copyrighted material and Fair Use</h3>
	<strong>
		In general, you are not allowed to use copyrighted material in the Summer of Math Exposition
		without permission; however, you can still use the content in such a way that it falls under <a
			href="https://support.google.com/legal/answer/4558992"
			target="_blank">fair use</a
		>.
	</strong>
	<p>What does this mean? Well…</p>
	<h3>Quick overview of Fair Use</h3>
	<p>
		Fair use is a bit of a gray area legally, but it is generally a way for creators to use
		copyrighted material in their own work by transforming its original intent. For example, if you
		make a video discussing the differences between two of your favorite animated shows, this could
		be considered Fair Use because your video is not merely providing the same function as those
		shows, entertainment, it’s serving a distinct function, namely an in-depth analysis. It’s even
		more likely to be considered Fair Use if you only show short clips of the content and not the
		content as a whole. In contrast, if you simply re-upload the animated shows on your youtube
		channel, that would be copyright infringement.
	</p>
	<h3>Quick examples</h3>
	<p>Totally OK:</p>
	<ul>
		<li>
			Let’s say you are making a video on Iterated Function Systems and you found some images of
			fractals you can generate with the method. It’s totally fine to use those images as long as
			you are using them as examples to better explain your own points.
		</li>
	</ul>
	<p>Totally <em>not</em> OK:</p>
	<ul>
		<li>
			Let’s say you are making a video and want some background music from Taylor Swift. Don’t do
			that.
		</li>
		<li>
			Let’s say you are making a blog post and find a great description of your topic in a textbook
			so you copy and paste that into your own work. That’s plagiarism. Don’t do that unless you
			properly cite the source and build off of it.
		</li>
	</ul>
	<h3>Conclusion</h3>
	<p>
		If you want to use copyrighted material in your video or blog post, err on the side of caution
		and don’t use it unless you either have the consent of the copyright holder, or your use fits
		the criteria of Fair Use. Otherwise, you might have a content claim to deal with, which is a
		huge pain.
	</p>
	<p>
		For the Summer of Math Exposition, just know that we will not consider entries which violate
		copyright law.
	</p>
	<h2 id="cc">On Creative Commons and Public Domain material</h2>
	<p>
		<strong>
			In general, you are permitted to use any material licensed under Creative Commons or Public
			Domain; however, there are some restrictions to keep in mind.
		</strong>
	</p>
	<p>
		<a href="https://creativecommons.org/about/cclicenses/">Creative Commons</a> (CC) licensing is a
		bit confusing, but is generally for material that is meant to be reused in other copyrighted
		work. That said, the creator of CC work is <em>still the copyright holder</em> and still has rights,
		they are simply sharing some of those rights with others to re-use or distribute their work as well.
	</p>
	<p>Let’s talk about what this means</p>
	<h3>CC0: Public Domain</h3>
	<p>
		Any content used under this license is fair game, no strings attached. That said, it would be
		nice to credit the creator of the material somewhere.
	</p>
	<h3>CC-BY: Creative Commons by an author</h3>
	<p>
		This is (probably) the most common CC license and the only one allowed to choose by default on
		youtube (more information on that in the “How to license CC work on youtube” section below).
		This license simply means you need to provide attribution to the original content creator when
		using CC-BY work. A good guide on how to do this can be found <a
			href="https://creativecommons.org/use-remix/">here</a
		>
	</p>
	<h3>CC-NC: Creative Commons Non-Commercial</h3>
	<p>
		This license simply means that you cannot use the CC content in any content that generates
		revenue. If you are using it for a classroom, that’s totally fine; however, you cannot put it in
		a youtube video if you also have ads enabled because you could be making income from the ads.
	</p>
	<p>
		For this reason, CC-NC can technically be used in the competition, but anything using CC-NC
		content is ineligible for winning the cash prize at the end. Such content can still be judged in
		the Peer Review and be manually judged by Grant, James, and the rest of the panel.
	</p>
	<h3>CC-SA: Creative Commons Share Alike</h3>
	<p>
		This license means that any derivative work should be under the same license. So if you use
		content under CC-SA, your future content <em>must also be under CC-SA!</em>
	</p>
	<p>
		At first, this might seem like an unusual request, but it’s a simple way to protect the
		copyright holder and also ensure there is more open content for other people to use in the
		future. If people using CC-SA work were allowed to change the license, they could (in
		principle), change the content into CC-BY content and then use the work under copyright,
		ultimately profiting from someone else’s copyright!
	</p>
	<h3>CC-ND: Creative Commons No Derivatives</h3>
	<p>
		This means that if you want to use the CC content in your own work, you must share it exactly as
		it was created, no modifications allowed.
	</p>
	<p>
		In general, treat CC-ND content as if it were under copyright. It can still be used under fair
		use without modifying the copyright of your final submission.
	</p>
	<h3>Putting it all together</h3>
	<p>
		CC licenses can also be mixed and matched, so if you see CC-BY-NC-SA, this means you need to
		abide by all the licenses:
	</p>
	<ul>
		<li>BY: provide attribution</li>
		<li>NC: you must use the content in a non-commercial way</li>
		<li>SA: you must use the same license on your own content (CC-BY-NC-SA in this case)</li>
	</ul>
	<h3>How to license CC work on youtube</h3>
	<p>
		For blog posts, it is clear how to license your content under CC: just put the CC license
		somewhere (preferably on every page). For youtube, things are a bit different.
	</p>
	<p>
		Youtube <em>does</em> allow content creators to use the CC-BY license by default, but any other CC
		licenses are not explicitly allowed. For the purposes of this competition, if you want to use other
		CC licenses, use the CC-BY license for your video and then specify the license you would like to
		use in the description.
	</p>
	<p>
		Note (again) that this is not legal advice and we are unsure of whether such licensing would
		hold up in court.
	</p>
	<h2 id="ai">On AI-generated material</h2>
	<p>
		<strong
			>In general, treat AI-generated material as if it were copyrighted by another party.
		</strong>
	</p>
	<p>
		This means that generative AI models (such as ChatGPT, Dalle, Midjourney, StableDiffusion, etc)
		should not be used to create any text, graphics, audio, or other media used in the final
		submission for the Summer of Math Exposition; however, such models can be used in any other
		stage of the creative process. The output of AI models <em>can</em> also be used if it’s in a way
		that falls under Fair Use.
	</p>
	<p>
		This is a slightly nuanced issue, so we will provide our justification for this statement here,
		along with examples of appropriate usage.
	</p>
	<h3>Justification</h3>
	<p>
		The main reason we forbid the usage of generative AI models in the final submissions for the
		Summer of Math Exposition is a logistical one: we cannot provide a monetary prize to someone who
		does not fully own the copyright to their work.
	</p>
	<p>
		Under current US law, it is unclear what license media from generated AI models should fall
		under. This ambiguity is the reason we wish to avoid generative models for this competition. For
		example, the output could be considered Public Domain (CC0) because it was created by something
		other than a human <a href="/content-policy#note-1">[1]</a> or derivative work from its training
		data <a href="/content-policy#note-2">[2]</a>. In neither of these cases can the person using
		the model claim copyright of its output unless the model clearly output’s the user’s “mental
		conception” (which might be a surprisingly high bar to clear)
		<a href="/content-policy#note-3">[3]</a>.
	</p>
	<p>
		On the one hand, we feel that generative AI models will be indispensable for creative
		individuals in all disciplines in the near future and feel that it would be against the spirit
		of the Summer of Math Exposition to discourage participants from learning tools that can help
		them create better content in the future. On the other hand, it would be irresponsible of us to
		allow people to potentially use software illegally in this competition. Once more laws are on
		the books, we will have a clearer idea of how AI can be used in content creation. For now,
		because it’s a gray area, we are dancing around it for this competition.
	</p>
	<p>
		We are happy to discuss this further on <a href="https://discord.gg/48ygmYHau7">discord</a>
	</p>
	<h3>Examples of appropriate usage</h3>
	<p>
		Though we ask all participants to avoid using AI in their entries (and also flag any
		AI-generated entries in the Peer Review), there are a few ways in which AI can be unambiguously
		used in SoME3. Namely, if AI is used at any part of the creative process besides in the final
		submission or if the AI work is being used as in Fair Use.
	</p>
	<h4>Using it as part of a creative workflow</h4>
	<p>
		It is totally fine to use AI as part of a creative workflow if no AI-generated media is present
		in the final submission for SoME3.
	</p>
	<p>Here are some specific examples:</p>
	<ul>
		<li>
			Let’s say you are making a video on the Hausdorff distance and are unsure of whether your
			script adequately explains the concept. You then ask ChatGPT for the key take-aways of your
			script to male sure your key-points are coming across. This is totally OK because you are
			using ChatGPT as a “second opinion” on the topic.
		</li>
		<li>
			Let’s say you are writing a blog post, but are unsure of what visuals to use in this case. You
			then ask Dalle to sketch up some ideas, which you then use as inspiration for your own visuals
			later on. This is also totally OK as long as you do not use the Dalle output in your final
			post. If you do decide to use the Dalle visuals in your post, then make sure you are using
			them in Fair Use (outlined below)
		</li>
	</ul>
	<h4>Using it in Fair Use</h4>
	<p>
		Let’s apply the Fair Use guidelines from the Copyrighted Material section above for specific
		cases of AI-generated media you would like to use for SoME3.
	</p>
	<p>Totally OK:</p>
	<ul>
		<li>
			<p>
				Using an AI-generated image in your video by <b>comparing it to hand-drawn</b> art or
				<b> using it as justification for a broader narrative </b> such as supplementary material to
				explain some mathematical concept.
			</p>
			<p>
				Specific example: let’s say you are making a video on eigenvalues and you ask Dalle to
				generate a “generic human face” and compare that to a paper you found on <a
					href="https://en.wikipedia.org/wiki/Eigenface#:~:text=An%20eigenface%20(%2F%CB%88a%C9%AA%C9%A1,Alex%20Pentland%20in%20face%20classification.)"
					>eigenfaces</a
				>. This is totally fine because you are comparing and contrasting Dalle’s output to a known
				concept in computer graphics as a way to better explain eigenvalues
			</p>
		</li>
		<li>
			<p>
				Using ChatGPT to generate a paragraph in your script and explaining <b
					>any inaccuracies you might have found.</b
				>
			</p>
			<p>
				Specific example: let’s say you are writing a blog post on determinants and you ask ChatGPT
				“What is a determinant.” You then incorporate this into your blog post as a way of
				showcasing what “most people” think about determinants and how your blog is going to change
				their perspective. This is totally fine because you are expressly using ChatGPT’s output in
				a broader narrative.
			</p>
		</li>
	</ul>
	<p>
		Totally <em>not</em> OK:
	</p>
	<ul>
		<li>
			<p>
				Using an AI-generated image in your video as “visual flair” to make a section of your video
				more visually interesting.
			</p>
			<p>
				Specific example: You have a few seconds in your video where you are just “talking to the
				camera” without anything visual on screen and are afraid people are going to click off
				because of it. To fix this, you ask Dalle to generate an image on your topic and show that
				instead. This is totally not ok because you are not addressing the image or using it in a
				broader narrative.
			</p>
		</li>
		<li>
			<p>
				Using ChatGPT to generate a paragraph in your script and pretending that <em>you</em> wrote it.
			</p>
			<p>
				Specific example: You do not know how to write the introduction to your blog post or video
				and ask ChatGPT to do it for you. This is totally <em>not</em> ok because you are pretending
				the output of ChatGPT is your own work without delineating it from your other content.
			</p>
		</li>
	</ul>
	<p>
		So here’s a general rule of thumb: If you are using AI and your audience cannot tell what part
		of your submission was made by AI, then you are not using it under fair use.
	</p>
	<h3>Notes</h3>
	<ol class="text-sm">
		<li id="note-1">
			<p>
				<b>AI in the Public Domain:</b> This argument follows the long-standing tradition of the US copyright
				office not to provide copyright to a piece of art unless it was created by a human. In such cases,
				the work falls under Public Domain. If this holds up for AI art, it would be possible to use
				it in videos, blogs, etc, for the purposes of this competition. Things to consider:
			</p>

			<ul>
				<li>
					There is a very interesting discussion about why copyright cannot be extended to non-human
					entities with the <a href="https://en.wikipedia.org/wiki/Monkey_selfie_copyright_dispute"
						>Monkey selfie copyright dispute</a
					>
					where a nature photographer managed to get a few monkeys to take a selfie of itself but neither
					the monkey nor the photographer were granted copyright of the image(s), and instead they were
					immediately put in the public domain. Also (because it’s interesting), the court case is
					<a href="https://www.lexisnexis.com/community/casebrief/p/casebrief-naruto-v-slater">
						Naruto vs Slater
					</a>
				</li>
				<li>
					It is not particularly likely that AI generated art will always be in the public domain.
					It only falls there for now while we wait on actual legislation.
				</li>
				<li>
					<a
						href="https://www.trustinsights.ai/blog/2022/10/ai-and-copyright-law-how-copyright-applies-to-ai-generated-content/"
						>Here</a
					> is an interview with an attorney supporting this opinion (but note that it’s not binding
					legal advice)
				</li>
			</ul>
		</li>
		<li id="note-2">
			<p>
				<b>AI as derivative work:</b> This argument follows the rights of each copyright holder in the
				training data. If their work was used to create derivative work, then their copyright was violated;
				however, the key question is what constitutes “derivative work,” which is currently unclear.
				In most cases, the AI must generate work that is “substantially similar” to pre-existing art
				– not just in a similar style! This is the most interesting area to watch regarding the future
				of AI in art. Things to consider:
			</p>
			<ul>
				<li>
					There are quite a few lawsuits currently being processed regarding the rights of artists
					who have had their art used in generative AI models without their consent
					<ol style="list-style-type: lower-roman">
						<li>
							<a href="https://githubcopilotlitigation.com/">https://githubcopilotlitigation.com/</a
							>: This is a class-action lawsuit against Microsoft, Github, and OpenAI claiming that
							Github Copilot has violated the copyright of each user’s software repository.
						</li>
						<li>
							GettyImages has sued Stability AI twice (in the <a
								href="https://fingfx.thomsonreuters.com/gfx/legaldocs/byvrlkmwnve/GETTY%20IMAGES%20AI%20LAWSUIT%20complaint.pdf"
								>US</a
							>
							and in the
							<a href="https://newsroom.gettyimages.com/en/getty-images/getty-images-statement"
								>UK</a
							>) for using their images in their AI models. Note that they can make the claim that
							the AI output is “substantially similar” because the GettyImages watermark regularly
							appears on generated images
						</li>
						<li>
							Individual <a
								href="https://www.theverge.com/2023/1/16/23557098/generative-ai-art-copyright-legal-lawsuit-stable-diffusion-midjourney-deviantart"
								>artists have also come forward</a
							> to file lawsuits against several companies
						</li>
					</ol>
				</li>
				<li>
					Though AI has been trained on copyrighted data, it <em>might</em> be considered fair use
					as in the case of
					<a href="https://en.wikipedia.org/wiki/Authors_Guild,_Inc._v._Google,_Inc"
						>The Author’s Guild v. Google</a
					>. Because the scanned data was not made publicly available.
				</li>
			</ul>
		</li>
		<li id="note-3">
			<b>AI when creating art that is the “mental conception” of the user:</b> As of March 15th,
			2023 the US Copyright Office has stated that some AI generated work may be copyrighted if (and
			only if) the output from the AI reflects the author's own "mental conception." This was
			further enforced on May 11th with a
			<a href="https://public-inspection.federalregister.gov/2023-05321.pdf">new policy statement</a
			>. Things to consider:
			<ul>
				<li>
					Note that the US Copyright Office <a href="https://tmsnrt.rs/3keyPot"
						>rejected the copyright</a
					> of an AI-generated comic book, but accepted the copyright of the text and arrangement of
					images.
				</li>
				<li>
					It is <a
						href="https://venturebeat.com/ai/generative-ai-output-could-be-eligible-for-copyright-protection-but-theres-a-catch/"
						>unclear</a
					> how much a human must interact with the generative models to claim copyright.
				</li>
				<li>
					For this competition, we simply note that there is a high bar to clear if the user of an
					AI model wants to copyright its output.
				</li>
			</ul>
		</li>
	</ol>
</article>
