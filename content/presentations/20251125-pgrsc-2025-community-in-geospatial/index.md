---
title: "The importance of community in geospatial"
slug: "pgrsc-2025-community-in-geospatial"
date: 2025-11-25
ptype: "talk"
event: "Pacific GIS and Remote Sensing Council Conference"
eventUrl: "https://pgrsc.org/2025-conference-resources/"
location: "Suva, Fiji"
affiliation: "Element 84"
note: "an impromptu talk, presented without slides"
tags: ["community", "open-source", "osgeo", "cloud-native", "open-data"]
links:
  - name: "conference proceedings (pdf)"
    href: "https://pgrsc.org/wp-content/uploads/2025/11/2025_Pacific_Islands_GIS_RS_User_Conference_proceedings_v4.pdf"
---

Transcript of the talk as delivered:

> Hello everyone -- or I suppose I should say bula! Kia ora! Namaste! As-salamu alaykum!
>
> I know from the introduction yesterday I've missed many greetings. So find me
> and tell me your greetings and tell me about where you are from, I know I have
> a lot to learn about all your cultures here in the pacific. This is my first
> time here, and it is a long way from where I live in Oregon in the United
> States. I thank you all for your welcomeness and hospitality.
>
> I wasn't really planning to present here at PGRSC. I was hesitant to propose a
> talk; I'll be honest, as a white man coming to the pacific for the first time,
> I didn't want to presume I had something valuable or useful to say. Yesterday
> though, I was inspired listening to the talks, and pulled this together.
> Forgive me, I don't have slides, but I think that'll be okay because I'm going
> to tell you a bit of a story.
>
> Let me begin by telling you all a bit more about me and why I am here.
>
> I am a geospatial software engineer at Element 84. We are a professional
> services company primarily working with customers in the United States and
> Europe. In my work there I do many things, but my role primarily revolves
> around two main focuses:
>
> 1. architecting and building data orchestration pipelines for satellite data
>    providers and large-scale data analytics, and
> 2. working in open source, specifically with cloud-native geospatial
>    technologies like the STAC ecosystem, low-level details of cloud-native
>    data formats, and API specifications.
>
> Because of this involvement with open source, I have been privileged to
> participate in conferences like FOSS4G. Last year I went to the conference in
> Belem, Brazil and met many amazing people from the geospatial community, in
> particular Kammy, who, if you don't know her, lives here in Suva.
>
> She just took me shopping, if you all couldn't tell.
>
> I am only here today to listen to you all and learn about the work that you
> all are doing because of that community, because of that connection with Kammy.
>
> I also attended FOSS4G in Auckland last week and it was an amazing experience.
> I got to collaborate with many key people in my focus area of cloud-native,
> but also got to hear from users and developers in other specializations. I
> came away from that experience with a long list of things to learn more about,
> projects to work on, and new ideas to investigate and prototype. Not only
> that, but I was able to share my work and ideas with others, to help them in
> their journeys.
>
> I've mentioned cloud-native geospatial several times now. Cloud-native is a
> big focus of my work. The idea with cloud-native, if you are not familiar, is
> use data formats that can be efficiently accessed over the network and store
> your data archives in cloud object store services like AWS S3. Then you can
> leverage tooling designed to efficiently work with those formats to build
> processing flows parallelized at scale using cloud compute services.
>
> I'm happy to talk more about this cloud-native thing if you have questions.
> Come find me. Or Alex. Or Nick. But my point is not to explain cloud-native in
> this talk.
>
> Rather, I want to talk about a couple concerns of mine:
>
> * First, major open data programs are at risk
> * second, cloud-native tools and formats are moving forward at a rapid pace,
>   and I get concerned users might get left behind
>
> To the first of these, we see programs like Landsat being threatened by
> politics, as Andiswa mentioned yesterday. The European Space Agency's sentinel
> program is similarly at risk of being locked down in certain ways due to
> increasing geopolitical tensions.
>
> Alex, what is the sentinel 2 data source for the digital earth programs? We
> have that on AWS in E84's Earth Search data catalog available for free, thanks
> to AWS's support. Except political tensions between ESA and AWS are threatening
> the future of maintaining that data catalog.
>
> On the tooling and formats side, ESA is currently moving forward with their
> plan to convert the entire sentinel archive to zarr format. Landsat and other
> NASA/USGS datasets might not be far behind. This is a major format change, and
> may mean that tools will not be compatible with those data products for some
> time, at least not until they can be updated to support the new format. And
> users that don't understand this or how to work with this new format might get
> left behind.
>
> These concerns, I think, are a problem of representation.
>
> I don't know what to do about the political problems, these risks to open
> data. I think the best answer is to make noise. If you don't think you have a
> voice, find allies that do to amplify yours. Leverage our geospatial community.
>
> Events like this are a great way to engage that community. As we've seen in
> some presentations today, you can also organize or participate in local GIS
> clubs, or international groups like ISPRS.
>
> But of course, I'm a bit biased and would also suggest OSGeo.
>
> And this gets at my second point about tooling: get involved! Open source
> tools and technologies underlie everything we use. QGIS is open source. ESRI
> products and Google Earth Engine are not open source, but they are built on top
> of open source projects like python and gdal. Many other tools like jupyter
> notebooks and R are open source.
>
> So talk with the OSGeo folks like Alex, Greg, and Ewen. Join OSGeo Oceania! Go
> to the conferences, both regional and international. Travel grants are often
> available. Meet and talk with users. Meet and talk with developers, like me.
> Make issues and pull requests on GitHub.
>
> Admittedly, with cloud-native geospatial, I believe we have an education
> problem. Education is a key goal of mine, and I have been working with the
> Cloud Native Geospatial Forum on defining a better curriculum and creating
> better resources for users. I, and many others, create workshops every year to
> present at FOSS4G conferences, on cloud native tools and other topics.
>
> But I don't know what you don't know. I don't know what you want to know. I
> don't know what gaps you all are seeing.
>
> Again, representation.
>
> If you can tell us what you need -- training, tooling, data -- we just might be
> able to help.
>
> I am only here because of FOSS4G. It has enriched my life and given me some of
> my best friends. It has also given me my career. So I encourage you, if you are
> not already, to get involved with OSGeo and OSGeo Oceania and join the open
> source community. Or, if nothing else, just come talk to me, because at the
> very least, I want to get to know you all and hear more about what you all are
> doing.
>
> Vinaka vakalevu.
