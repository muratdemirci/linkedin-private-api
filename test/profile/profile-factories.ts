import Chance from 'chance';
import { random, times } from 'lodash';
import { LinkedInCompany, LinkedInProfile, LinkedInVectorArtifact, LinkedInVectorImage } from 'src';

import { LinkedInMiniProfile } from '../../src/entities/linkedin-mini-profile.entity';
import { LinkedInPhotoFilterPicture } from '../../src/entities/linkedin-profile.entity';

const chance = new Chance();
export const createMiniProfileId = () => `urn:li:fs_miniProfile:${chance.guid()}`;

const createVectorArtifact = (count: number): LinkedInVectorArtifact[] =>
  times(count, () => ({
    $type: 'com.linkedin.common.VectorArtifact',
    expiresAt: chance.integer(),
    fileIdentifyingUrlPathSegment: chance.url(),
    height: chance.integer(),
    with: chance.integer(),
  }));

const createVectorImage = (count: number): LinkedInVectorImage[] =>
  times(count, () => ({
    $type: 'com.linkedin.common.VectorImage',
    artifacts: createVectorArtifact(4),
    rootUrl: chance.url(),
  }));

const createCompany = (count: number): LinkedInCompany[] =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.dash.organization.Company',
    $anti_abuse_annotations: [{ attributeId: chance.integer(), entityId: chance.integer() }],
    $recipeTypes: [chance.word()],
    entityUrn: chance.guid(),
    industry: { [chance.guid()]: chance.word() },
    industryUrns: [chance.guid()],
    logo: {
      vetorImage: createVectorImage(1)[0],
    },
    name: chance.name(),
    universalName: chance.name(),
    url: chance.url(),
  }));

const createProfilePicture = (count: number): LinkedInPhotoFilterPicture[] =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.dash.identity.profile.PhotoFilterPicture',
    $recipeTypes: [chance.guid()],
    displayImageReference: {
      vectorImage: createVectorImage(1)[0],
    },
    displayImageUrn: chance.guid(),
    photoFilterEditInfo: {},
  }));

const createProfile = (count: number): Partial<LinkedInProfile>[] =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.dash.identity.profile.Profile',
    '*industry': chance.guid(),
    '*profileCertifications': chance.guid(),
    '*profileCourses': chance.guid(),
    '*profileEducations': chance.guid(),
    '*profileHonors': chance.guid(),
    '*profileLanguages': chance.guid(),
    '*profileOrganizations': chance.guid(),
    '*profilePatents': chance.guid(),
    '*profilePositionGroups': chance.guid(),
    '*profileProjects': chance.guid(),
    '*profilePublications': chance.guid(),
    '*profileSkills': chance.guid(),
    '*profileTestScores': chance.guid(),
    '*profileTreasuryMediaProfile': chance.guid(),
    '*profileVolunteerExperiences': chance.guid(),
    $recipeTypes: times(3, () => chance.guid()),
    defaultToActivityTab: chance.bool(),
    educationOnProfileTopCardShown: chance.bool(),
    entityUrn: createMiniProfileId(),
    firstName: chance.first(),
    lastName: chance.last(),
    geoLocationBackfilled: chance.bool(),
    headline: chance.word(),
    industryUrn: chance.guid(),
    locationName: chance.word(),
    objectUrn: chance.guid(),
    profilePicture: createProfilePicture(1)[0],
    publicIdentifier: chance.guid(),
    trackingId: chance.guid(),
    versionTag: chance.guid(),
  }));

export const createMiniProfile = (count: number): LinkedInMiniProfile[] =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.identity.shared.MiniProfile',
    trackingId: chance.guid(),
    firstName: chance.word(),
    lastName: chance.word(),
    publicIdentifier: chance.guid(),
    objectUrn: chance.guid(),
    entityUrn: createMiniProfileId(),
    occupation: chance.word(),
    picture: createVectorImage(1)[0],
    backgroundImage: createVectorImage(1)[0],
  }));

export const createGetProfileResponse = () => {
  const profiles = createProfile(10);
  const companies = createCompany(10);

  const resultProfile = profiles[random(0, 9)];
  const resultCompany = companies[random(0, 9)];

  resultProfile.headline = `${chance.word} at ${resultCompany.name}`;

  const response = {
    data: {
      data: {},
    },
    included: [...profiles, ...companies],
  };

  return { response, resultProfile, resultCompany };
};

export const createGetOwnProfileResponse = () => {
  const resultProfile = createMiniProfile(1)[0];

  const response = {
    data: {
      $type: 'com.linkedin.voyager.common.Me',
      '*miniProfile': resultProfile.entityUrn,
      plainId: chance.integer(),
      premiumSubscriber: chance.bool(),
      publicContactInfo: {
        $type: 'com.linkedin.voyager.identity.shared.PublicContactInfo',
      },
    },
    included: [resultProfile],
  };

  return { response, resultProfile };
};
