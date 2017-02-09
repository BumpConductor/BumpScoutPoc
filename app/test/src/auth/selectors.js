import * as selectors from '../../../src/auth/selectors';

describe('auth', () => {
  describe('selectors', () => {
    describe('hasError', () => {
      it('should return true when the error field is set', () => {
        selectors.hasError({error: new Error('error')}).should.eql(true);
      });

      it('should return false when the error field is not set', () => {
        selectors.hasError({}).should.eql(false);
      });
    });

    describe('errorText', () => {
      it('should return the error text when the error field is set', () => {
        selectors.errorText({error: new Error('error')})
        .should.eql('Error: error');
      });

      it('should return empty string when the error field is not set', () => {
        selectors.errorText({}).should.eql('');
      });
    });

    describe('isPending', () => {
      it('should return true when the pending field is set', () => {
        selectors.isPending({pending: true}).should.eql(true);
      });

      it('should return false when the pending field is not set', () => {
        selectors.isPending({}).should.eql(false);
      });
    });

    describe('isSignedIn', () => {
      it('should return true when the user field is set', () => {
        selectors.isSignedIn({user: 'user'}).should.eql(true);
      });

      it('should return false when the user field is not set', () => {
        selectors.isSignedIn({}).should.eql(false);
      });
    });

    describe('displayName', () => {
      it('should return the displayName when the user field is set', () => {
        selectors.displayName({user: {displayName: 'Fred Bloggs'}})
        .should.eql('Fred Bloggs');
      });

      it('should return the email if the displayName is not set', () => {
        selectors.displayName({user: {email: 'frad@bloggs.com'}})
        .should.eql('frad@bloggs.com');
      });

      it('should return empty string when the user field is not set', () => {
        selectors.displayName({}).should.eql('');
      });
    });

    describe('isSignedOut', () => {
      it('should return true if not pending or signed in', () => {
        selectors.isSignedOut({}).should.eql(true);
      });

      it('should return false if signed in', () => {
        selectors.isSignedOut({user: 'user'}).should.eql(false);
      });

      it('should return false if pending', () => {
        selectors.isSignedOut({pending: true}).should.eql(false);
      });
    });

    describe('email', () => {
      it('should return the email when the email field is set', () => {
        selectors.email({email: 'fred@bloggs.com'})
        .should.eql('fred@bloggs.com');
      });

      it('should return empty string when the email field is not set', () => {
        selectors.email({}).should.eql('');
      });
    });
  });
});
